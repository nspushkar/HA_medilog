"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AuthButtons from "@/components/auth/authButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePicker } from "@/components/ui/time-picker";
import { Upload, FileText, Camera, Edit, Send, Clock, CheckCircle, AlertCircle, X, Plus, Mail } from "lucide-react";
import Link from "next/link";
import { EmailService } from "@/utils/email-service";
import { useSession } from "next-auth/react";

export default function UploadPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [reminderTime, setReminderTime] = useState("12:00");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminders, setReminders] = useState<Array<{time: string, frequency: string}>>([]);

  // Get email from session
  const userEmail = session?.user?.email || "";

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Simulate OCR processing
    setIsProcessing(true);
    setTimeout(() => {
      setOcrText("OCR processing complete.\n\nPlease review and edit the extracted text below.\n\n[Text will be extracted from your uploaded document]");
      setIsProcessing(false);
    }, 2000);
  };

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleSetReminder = () => {
    if (reminderTime && frequency) {
      const newReminder = { time: reminderTime, frequency };
      setReminders([...reminders, newReminder]);
      setReminderTime("12:00");
      setFrequency("");
      setShowReminderModal(false);
    }
  };

  const removeReminder = (index: number) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  const scheduleEmailReminder = async (reminder: {time: string, frequency: string}) => {
    try {
      const emailService = EmailService.getInstance();
      
      const reminderData = {
        email: userEmail, // Use userEmail from session
        medicationName,
        dosage,
        frequency: reminder.frequency,
        reminderTime: reminder.time,
        scheduledFor: new Date().toISOString()
      };
      
      // Schedule the email reminder
      const success = await emailService.scheduleReminder(reminderData);
      
      if (success) {
        console.log(`✅ Email reminder scheduled for ${reminder.time} ${reminder.frequency}`);
      }
      
      return success;
    } catch (error) {
      console.error("Failed to schedule email reminder:", error);
      return false;
    }
  };

  const handleSaveAndOrganize = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    
    try {
      // Simulate API call for saving and organizing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const prescriptionData = {
        fileName: selectedFile?.name || "Untitled",
        medicationName,
        dosage,
        frequency,
        doctorName,
        reminders,
        ocrText,
        status: "organized",
        uploadedAt: new Date().toISOString(),
        folder: "Prescriptions"
      };
      
      // Store in localStorage
      const existingRecords = JSON.parse(localStorage.getItem("medilog_records") || "[]");
      existingRecords.push(prescriptionData);
      localStorage.setItem("medilog_records", JSON.stringify(existingRecords));
      
      // Store reminders and schedule email notifications
      if (reminders.length > 0) {
        const reminderData = reminders.map(reminder => ({
          type: "medication",
          medicationName,
          dosage,
          frequency: reminder.frequency,
          reminderTime: reminder.time,
          createdAt: new Date().toISOString()
        }));
        
        const existingReminders = JSON.parse(localStorage.getItem("medilog_reminders") || "[]");
        existingReminders.push(...reminderData);
        localStorage.setItem("medilog_reminders", JSON.stringify(existingReminders));
        
        // Schedule email reminders
        for (const reminder of reminders) {
          await scheduleEmailReminder(reminder);
        }
      }
      
      setSaveStatus("success");
      setSaveMessage("Prescription saved and organized successfully!");
      
      // Redirect to dashboard after successful save
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
      
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage("Failed to save prescription. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-sm px-4 md:px-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
            ← Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Upload Prescription</h1>
        </div>
        <AuthButtons />
      </header>
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Save Status Message */}
          {saveStatus !== "idle" && (
            <div className={`mb-6 p-4 rounded-xl flex items-center space-x-2 shadow-lg ${
              saveStatus === "success" 
                ? "bg-green-50 border border-green-200 text-green-800" 
                : "bg-red-50 border border-red-200 text-red-800"
            }`}>
              {saveStatus === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{saveMessage}</span>
            </div>
          )}

          {/* Upload Section */}
          <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-6 w-6" />
                <span>Upload Medical Document</span>
              </CardTitle>
              <CardDescription className="text-blue-100">
                Upload a prescription, lab report, or any medical document for OCR processing
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* File Upload */}
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleCameraCapture}
                      className="hidden"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Choose a file or drag it here
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports JPG, PNG, PDF up to 10MB
                      </p>
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={handleTakePhoto}
                      className="h-12 bg-white hover:bg-gray-50 border-2 hover:border-blue-300 transition-all duration-200"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      Take Photo
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleBrowseFiles}
                      className="h-12 bg-white hover:bg-gray-50 border-2 hover:border-blue-300 transition-all duration-200"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Browse Files
                    </Button>
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                  {previewUrl && (
                    <div className="border rounded-xl p-4 bg-white shadow-sm">
                      <h3 className="font-medium mb-3 text-gray-700">Preview</h3>
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  )}
                  
                  {isProcessing && (
                    <div className="border rounded-xl p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-gray-700 font-medium">Processing OCR...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* OCR Results */}
          {ocrText && (
            <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <FileText className="h-6 w-6" />
                    <span>Extracted Text</span>
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "View" : "Edit"}
                  </Button>
                </CardTitle>
                <CardDescription className="text-green-100">
                  Review and edit the extracted text from your document
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  value={ocrText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOcrText(e.target.value)}
                  className="min-h-[200px] font-mono text-sm border-2 focus:border-blue-400 transition-colors"
                  readOnly={!isEditing}
                />
              </CardContent>
            </Card>
          )}

          {/* Medication Details */}
          {ocrText && (
            <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                <CardTitle>Medication Details</CardTitle>
                <CardDescription className="text-purple-100">
                  Fill in the medication information for better organization
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="medication" className="text-gray-700 font-medium">Medication Name</Label>
                      <Input
                        id="medication"
                        value={medicationName}
                        onChange={(e) => setMedicationName(e.target.value)}
                        placeholder="e.g., Amoxicillin"
                        className="mt-1 border-2 focus:border-blue-400 transition-colors"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dosage" className="text-gray-700 font-medium">Dosage</Label>
                      <Select value={dosage} onValueChange={setDosage}>
                        <SelectTrigger className="mt-1 border-2 focus:border-blue-400 transition-colors">
                          <SelectValue placeholder="Select dosage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="250mg">250mg</SelectItem>
                          <SelectItem value="500mg">500mg</SelectItem>
                          <SelectItem value="750mg">750mg</SelectItem>
                          <SelectItem value="1000mg">1000mg</SelectItem>
                          <SelectItem value="5ml">5ml</SelectItem>
                          <SelectItem value="10ml">10ml</SelectItem>
                          <SelectItem value="1 tablet">1 tablet</SelectItem>
                          <SelectItem value="2 tablets">2 tablets</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="frequency" className="text-gray-700 font-medium">Frequency</Label>
                      <Select value={frequency} onValueChange={setFrequency}>
                        <SelectTrigger className="mt-1 border-2 focus:border-blue-400 transition-colors">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Once daily">Once daily</SelectItem>
                          <SelectItem value="Twice daily">Twice daily</SelectItem>
                          <SelectItem value="Three times daily">Three times daily</SelectItem>
                          <SelectItem value="Every 6 hours">Every 6 hours</SelectItem>
                          <SelectItem value="Every 8 hours">Every 8 hours</SelectItem>
                          <SelectItem value="Every 12 hours">Every 12 hours</SelectItem>
                          <SelectItem value="As needed">As needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="doctor" className="text-gray-700 font-medium">Doctor Name</Label>
                      <Input
                        id="doctor"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        placeholder="e.g., Dr. Smith"
                        className="mt-1 border-2 focus:border-blue-400 transition-colors"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium">Reminders</Label>
                      <div className="mt-2 space-y-2">
                        {userEmail && (
                          <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-200">
                            <Mail className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-800">
                              Reminders will be sent to <strong>{userEmail}</strong>
                            </span>
                          </div>
                        )}
                        {reminders.map((reminder, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div>
                              <p className="font-medium text-gray-900">{reminder.time}</p>
                              <p className="text-sm text-gray-600">{reminder.frequency}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeReminder(index)}
                              className="text-red-600 hover:text-red-700 border-red-300"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          onClick={() => setShowReminderModal(true)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={!userEmail}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Reminder
                        </Button>
                        {!userEmail && (
                          <p className="text-xs text-red-600 text-center">
                            Please sign in with an email to set reminders
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {ocrText && (
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveAndOrganize}
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Send className="h-5 w-5 mr-2" />
                {isSaving ? "Saving..." : "Save & Organize"}
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Add Reminder</span>
              </CardTitle>
              <CardDescription>Set a medication reminder with email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-gray-700 font-medium mb-3 block">Time</Label>
                <TimePicker 
                  value={reminderTime} 
                  onChange={setReminderTime}
                  className="justify-start"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium mb-2 block">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className="border-2 focus:border-blue-400">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Once daily">Once daily</SelectItem>
                    <SelectItem value="Twice daily">Twice daily</SelectItem>
                    <SelectItem value="Three times daily">Three times daily</SelectItem>
                    <SelectItem value="Every 6 hours">Every 6 hours</SelectItem>
                    <SelectItem value="Every 8 hours">Every 8 hours</SelectItem>
                    <SelectItem value="Every 12 hours">Every 12 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Email reminder will be sent to <strong>{userEmail}</strong>
                </span>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowReminderModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSetReminder}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!reminderTime || !frequency || !userEmail}
                >
                  Add Reminder
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 