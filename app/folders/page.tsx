"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AuthButtons from "@/components/auth/authButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Folder, Plus, FileText, Calendar, Search } from "lucide-react";
import Link from "next/link";

interface FolderData {
  name: string;
  count: number;
  lastUpdated: string;
  totalSize: string;
  color: string;
  iconColor: string;
}

export default function FoldersPage() {
  const { data: session, status } = useSession();
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      redirect("/");
      return;
    }

    // Load real data from localStorage
    const records = JSON.parse(localStorage.getItem("medilog_records") || "[]");
    
    // Group records by folder and calculate stats
    const folderStats = records.reduce((acc: any, record: any) => {
      const folderName = record.folder || "Uncategorized";
      if (!acc[folderName]) {
        acc[folderName] = {
          count: 0,
          lastUpdated: record.uploadedAt,
          totalSize: "0 MB"
        };
      }
      acc[folderName].count++;
      if (new Date(record.uploadedAt) > new Date(acc[folderName].lastUpdated)) {
        acc[folderName].lastUpdated = record.uploadedAt;
      }
      return acc;
    }, {});

    // Convert to folder data with colors
    const folderColors = [
      { color: "blue", iconColor: "text-blue-600" },
      { color: "green", iconColor: "text-green-600" },
      { color: "purple", iconColor: "text-purple-600" },
      { color: "orange", iconColor: "text-orange-600" },
      { color: "red", iconColor: "text-red-600" },
      { color: "indigo", iconColor: "text-indigo-600" }
    ];

    const folderData: FolderData[] = Object.entries(folderStats).map(([name, stats]: [string, any], index) => ({
      name,
      count: stats.count,
      lastUpdated: stats.lastUpdated,
      totalSize: `${(stats.count * 2.1).toFixed(1)} MB`, // Simulate file sizes
      color: folderColors[index % folderColors.length].color,
      iconColor: folderColors[index % folderColors.length].iconColor
    }));

    // Add default folders if no data exists
    if (folderData.length === 0) {
      folderData.push(
        { name: "Prescriptions", count: 0, lastUpdated: "", totalSize: "0 MB", color: "blue", iconColor: "text-blue-600" },
        { name: "Lab Reports", count: 0, lastUpdated: "", totalSize: "0 MB", color: "green", iconColor: "text-green-600" },
        { name: "Medical History", count: 0, lastUpdated: "", totalSize: "0 MB", color: "purple", iconColor: "text-purple-600" },
        { name: "Vaccinations", count: 0, lastUpdated: "", totalSize: "0 MB", color: "orange", iconColor: "text-orange-600" },
        { name: "Insurance", count: 0, lastUpdated: "", totalSize: "0 MB", color: "red", iconColor: "text-red-600" }
      );
    }

    setFolders(folderData);
  }, [session, status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect("/");
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            ← Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gray-900">My Folders</h1>
        </div>
        <AuthButtons />
      </header>
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Organize Your Records</h2>
              <p className="text-gray-600">Create folders to organize your medical documents by category</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search folders and records..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Folders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFolders.map((folder, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 bg-${folder.color}-100 rounded-lg flex items-center justify-center`}>
                      <Folder className={`h-6 w-6 ${folder.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{folder.name}</h3>
                      <p className="text-sm text-gray-500">{folder.count} documents</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last updated</span>
                      <span className="text-gray-900">{formatDate(folder.lastUpdated)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total size</span>
                      <span className="text-gray-900">{folder.totalSize}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Create New Folder */}
            <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Create New Folder</h3>
                <p className="text-sm text-gray-500">Organize your medical records</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 