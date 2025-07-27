"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AuthButtons from "@/components/auth/authButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Folder, FileText, Upload, Bell, Calendar } from "lucide-react";
import Link from "next/link";

interface MedicalRecord {
  fileName: string;
  medicationName?: string;
  doctorName?: string;
  uploadedAt: string;
  status: string;
  folder?: string;
}

interface Reminder {
  type: string;
  medicationName?: string;
  appointmentTitle?: string;
  reminderTime?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [recentUploads, setRecentUploads] = useState<MedicalRecord[]>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      redirect("/");
      return;
    }

    // Load real data from localStorage
    const records = JSON.parse(localStorage.getItem("medilog_records") || "[]");
    const reminders = JSON.parse(localStorage.getItem("medilog_reminders") || "[]");
    
    // Get recent uploads (last 5)
    const recent = records
      .sort((a: MedicalRecord, b: MedicalRecord) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(0, 5);
    
    setRecentUploads(recent);
    setUpcomingReminders(reminders);
  }, [session, status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect("/");
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">MediLog Dashboard</h1>
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
        <AuthButtons />
      </header>
      
      <main className="flex-1 p-4 md:p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user?.name || session.user?.email || "User"}! 👋
          </h2>
          <p className="text-gray-600">
            Manage your medical records, prescriptions, and health reminders in one place.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/upload">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-blue-200 hover:border-blue-400">
              <CardContent className="p-6 text-center">
                <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Upload Prescription</h3>
                <p className="text-sm text-gray-600">Scan and upload your medical documents</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/folders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Folder className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">My Folders</h3>
                <p className="text-sm text-gray-600">Organize your medical records</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/reminders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Bell className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Reminders</h3>
                <p className="text-sm text-gray-600">Manage medication reminders</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/records">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">All Records</h3>
                <p className="text-sm text-gray-600">View all your medical records</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Uploads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Recent Uploads</span>
              </CardTitle>
              <CardDescription>Your latest medical documents</CardDescription>
            </CardHeader>
            <CardContent>
              {recentUploads.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No uploads yet</p>
                  <p className="text-sm">Upload your first prescription to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentUploads.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {record.medicationName || record.fileName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {record.doctorName && `Dr. ${record.doctorName} • `}
                            {formatDate(record.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Upcoming Reminders</span>
              </CardTitle>
              <CardDescription>Medication and appointment reminders</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingReminders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No reminders set</p>
                  <p className="text-sm">Set medication reminders to stay on track</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingReminders.slice(0, 3).map((reminder, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Bell className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {reminder.medicationName || reminder.appointmentTitle}
                          </p>
                          <p className="text-sm text-gray-500">
                            {reminder.reminderTime && `Due at ${reminder.reminderTime}`}
                            {reminder.appointmentDate && ` ${reminder.appointmentDate} at ${reminder.appointmentTime}`}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        Take Now
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}