"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  FileText,
  MapPin,
  Clock,
  Target,
  X,
  CheckCircle,
  AlertCircle,
  ImageIcon,
  Video,
  FileUp,
  Mic,
  MicOff,
} from "lucide-react"

interface Assignment {
  id: string
  title: string
  subject: string
  description: string
  type: "image" | "video" | "document"
  dueDate: Date
  xpReward: number
  difficulty: "Easy" | "Medium" | "Hard"
  requirements: string[]
}

interface AssignmentSubmissionModalProps {
  assignment: Assignment
  onClose: () => void
  onSubmit: (submissionData: any) => void
}

export default function AssignmentSubmissionModal({ assignment, onClose, onSubmit }: AssignmentSubmissionModalProps) {
  const [step, setStep] = useState(1)
  const [files, setFiles] = useState<File[]>([])
  const [notes, setNotes] = useState("")
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    setFiles([...files, ...selectedFiles])
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const getLocationData = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // In a real app, you'd use a geocoding service to get the address
          setLocation({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    // In a real app, you'd start actual recording here
    const interval = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)

    // Auto-stop after 5 minutes for demo
    setTimeout(() => {
      setIsRecording(false)
      clearInterval(interval)
    }, 300000)
  }

  const stopRecording = () => {
    setIsRecording(false)
    // In a real app, you'd stop recording and add the file
  }

  const handleSubmit = () => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          onSubmit({
            assignmentId: assignment.id,
            files,
            notes,
            location,
            submittedAt: new Date().toISOString(),
          })
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />
    if (file.type.startsWith("video/")) return <Video className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-800">{assignment.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {assignment.subject} • {assignment.difficulty}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 3 && <div className={`w-12 h-1 mx-2 ${step > stepNum ? "bg-primary" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Upload Files</span>
            <span>Add Details</span>
            <span>Submit</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Assignment Details */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Assignment Requirements:</h3>
            <p className="text-sm text-gray-700 mb-3">{assignment.description}</p>
            <div className="flex flex-wrap gap-2">
              {assignment.requirements?.map((req, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {req}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Due: {assignment.dueDate.toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {assignment.xpReward} XP
              </span>
            </div>
          </div>

          {/* Step 1: File Upload */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Upload Your Files</h3>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload className="w-12 h-12 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                    <Input
                      type="file"
                      multiple
                      accept={assignment.type === "image" ? "image/*" : assignment.type === "video" ? "video/*" : "*"}
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer bg-transparent">
                        <FileUp className="w-4 h-4 mr-2" />
                        Choose Files
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              {/* Recording Option for Video */}
              {assignment.type === "video" && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3">Or Record Video</h4>
                  <div className="flex items-center gap-4">
                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      onClick={isRecording ? stopRecording : startRecording}
                      className="flex items-center gap-2"
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </Button>
                    {isRecording && (
                      <div className="flex items-center gap-2 text-red-600">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                        <span className="text-sm font-mono">{formatTime(recordingTime)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Uploaded Files List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Uploaded Files:</h4>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file)}
                        <div>
                          <p className="text-sm font-medium text-gray-800">{file.name}</p>
                          <p className="text-xs text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={files.length === 0}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  Next: Add Details
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Add Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Add Details</h3>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description & Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your work, challenges faced, what you learned..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Location (Optional)</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={getLocationData}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <MapPin className="w-4 h-4" />
                    Get Current Location
                  </Button>
                  {location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Location captured</span>
                    </div>
                  )}
                </div>
                {location && <p className="text-xs text-gray-600 mt-2">📍 {location.address}</p>}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  Next: Review & Submit
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Review Your Submission</h3>

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <h4 className="font-medium text-gray-800">Files ({files.length})</h4>
                  <div className="text-sm text-gray-600">{files.map((f) => f.name).join(", ")}</div>
                </div>

                {notes && (
                  <div>
                    <h4 className="font-medium text-gray-800">Notes</h4>
                    <p className="text-sm text-gray-600">{notes}</p>
                  </div>
                )}

                {location && (
                  <div>
                    <h4 className="font-medium text-gray-800">Location</h4>
                    <p className="text-sm text-gray-600">📍 {location.address}</p>
                  </div>
                )}
              </div>

              {/* AI Verification Notice */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">AI Verification Enabled</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your submission will be automatically analyzed for authenticity, relevance, and quality. This
                      helps ensure fair grading and provides instant feedback.
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Uploading and processing...</span>
                    <span className="text-gray-600">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)} disabled={isUploading}>
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isUploading}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  {isUploading ? "Submitting..." : "Submit Assignment"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
