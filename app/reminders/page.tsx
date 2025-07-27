"use client";

import { useState } from "react";
import AuthButtons from "@/components/auth/authButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Plus, Clock, Calendar, Pill, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function RemindersPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [reminderType, setReminderType] = useState("medication");
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [appointmentTitle, setAppointmentTitle] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const handleAddReminder = () => {
    // Add reminder logic here
    console.log("Adding reminder:", {
      type: reminderType,
      medicationName,
      dosage,
      frequency,
      reminderTime,
      appointmentTitle,
      appointmentDate,
      appointmentTime
    });
    setShowAddForm(false);
    // Reset form
    setMedicationName("");
    setDosage("");
    setFrequency("");
    setReminderTime("");
    setAppointmentTitle("");
    setAppointmentDate("");
    setAppointmentTime("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            ← Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Reminders</h1>
        </div>
        <AuthButtons />
      </header>
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage Your Reminders</h2>
              <p className="text-gray-600">Set medication reminders and track appointments</p>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </div>

          {/* Today's Reminders */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-6 w-6" />
                <span>Today's Reminders</span>
              </CardTitle>
              <CardDescription>Your scheduled reminders for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Pill className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Amoxicillin 500mg</p>
                      <p className="text-sm text-gray-500">Due in 30 minutes</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Take
                    </Button>
                    <Button variant="outline" size="sm">
                      <XCircle className="h-4 w-4 mr-1" />
                      Skip
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Dr. Johnson Appointment</p>
                      <p className="text-sm text-gray-500">Today at 2:00 PM</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Clock className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-6 w-6" />
                <span>All Reminders</span>
              </CardTitle>
              <CardDescription>Your complete list of reminders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Pill className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Paracetamol 650mg</p>
                      <p className="text-sm text-gray-500">Every 6 hours • Next: Tomorrow 8:00 AM</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Blood Test Follow-up</p>
                      <p className="text-sm text-gray-500">Next week • Tuesday 10:00 AM</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Pill className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Vitamin D Supplement</p>
                      <p className="text-sm text-gray-500">Daily • Next: Tomorrow 9:00 AM</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Reminder Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <CardTitle>Add New Reminder</CardTitle>
                  <CardDescription>Create a medication or appointment reminder</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Reminder Type</Label>
                    <div className="flex space-x-2 mt-2">
                      <Button
                        variant={reminderType === "medication" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setReminderType("medication")}
                      >
                        <Pill className="h-4 w-4 mr-1" />
                        Medication
                      </Button>
                      <Button
                        variant={reminderType === "appointment" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setReminderType("appointment")}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Appointment
                      </Button>
                    </div>
                  </div>

                  {reminderType === "medication" ? (
                    <>
                      <div>
                        <Label htmlFor="medication">Medication Name</Label>
                        <Input
                          id="medication"
                          value={medicationName}
                          onChange={(e) => setMedicationName(e.target.value)}
                          placeholder="e.g., Amoxicillin"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dosage">Dosage</Label>
                        <Input
                          id="dosage"
                          value={dosage}
                          onChange={(e) => setDosage(e.target.value)}
                          placeholder="e.g., 500mg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="frequency">Frequency</Label>
                        <Input
                          id="frequency"
                          value={frequency}
                          onChange={(e) => setFrequency(e.target.value)}
                          placeholder="e.g., Twice daily"
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Reminder Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={reminderTime}
                          onChange={(e) => setReminderTime(e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="title">Appointment Title</Label>
                        <Input
                          id="title"
                          value={appointmentTitle}
                          onChange={(e) => setAppointmentTitle(e.target.value)}
                          placeholder="e.g., Dr. Smith Checkup"
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={appointmentDate}
                          onChange={(e) => setAppointmentDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="appointment-time">Time</Label>
                        <Input
                          id="appointment-time"
                          type="time"
                          value={appointmentTime}
                          onChange={(e) => setAppointmentTime(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <div className="flex space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddReminder}
                      className="flex-1"
                    >
                      Add Reminder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 