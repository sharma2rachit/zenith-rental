import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LicenseUploadProps {
  onComplete: (licenseData: any) => void;
}

const LicenseUpload = ({ onComplete }: LicenseUploadProps) => {
  const { toast } = useToast();
  const [licenseData, setLicenseData] = useState({
    licenseNumber: '',
    name: '',
    dateOfBirth: '',
    validFrom: '',
    validTo: '',
    address: '',
    licenseClass: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<{
    front: File | null;
    back: File | null;
  }>({
    front: null,
    back: null
  });

  const handleFileUpload = (side: 'front' | 'back', file: File) => {
    if (file && file.type.startsWith('image/')) {
      setUploadedFiles(prev => ({ ...prev, [side]: file }));
      toast({
        title: "File uploaded successfully",
        description: `${side} side of license uploaded.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = () => {
    if (!licenseData.licenseNumber || !licenseData.name || !uploadedFiles.front || !uploadedFiles.back) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields and upload both sides of your license.",
        variant: "destructive",
      });
      return;
    }

    const completeData = {
      ...licenseData,
      files: uploadedFiles,
      uploadedAt: new Date().toISOString(),
      verified: false
    };

    onComplete(completeData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Driver's License Verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* License Information Form */}
        <div className="space-y-4">
          <h3 className="font-semibold">License Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="licenseNumber">License Number *</Label>
              <Input
                id="licenseNumber"
                value={licenseData.licenseNumber}
                onChange={(e) => setLicenseData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                placeholder="Enter your license number"
              />
            </div>
            
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={licenseData.name}
                onChange={(e) => setLicenseData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={licenseData.dateOfBirth}
                onChange={(e) => setLicenseData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="licenseClass">License Class</Label>
              <Input
                id="licenseClass"
                value={licenseData.licenseClass}
                onChange={(e) => setLicenseData(prev => ({ ...prev, licenseClass: e.target.value }))}
                placeholder="e.g., LMV-NT"
              />
            </div>
            
            <div>
              <Label htmlFor="validFrom">Valid From</Label>
              <Input
                id="validFrom"
                type="date"
                value={licenseData.validFrom}
                onChange={(e) => setLicenseData(prev => ({ ...prev, validFrom: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="validTo">Valid To</Label>
              <Input
                id="validTo"
                type="date"
                value={licenseData.validTo}
                onChange={(e) => setLicenseData(prev => ({ ...prev, validTo: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={licenseData.address}
              onChange={(e) => setLicenseData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter your address"
            />
          </div>
        </div>

        {/* File Upload Section */}
        <div className="space-y-4">
          <h3 className="font-semibold">Upload License Photos</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Front Side */}
            <div className="space-y-2">
              <Label>Front Side *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {uploadedFiles.front ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-8 h-8 mx-auto text-green-500" />
                    <p className="text-sm text-green-600">Front side uploaded</p>
                    <p className="text-xs text-gray-500">{uploadedFiles.front.name}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500">Upload front side</p>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('front', e.target.files[0])}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Back Side */}
            <div className="space-y-2">
              <Label>Back Side *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {uploadedFiles.back ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-8 h-8 mx-auto text-green-500" />
                    <p className="text-sm text-green-600">Back side uploaded</p>
                    <p className="text-xs text-gray-500">{uploadedFiles.back.name}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500">Upload back side</p>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('back', e.target.files[0])}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Important Notice</h4>
              <p className="text-sm text-blue-800 mt-1">
                • Your license must be valid and not expired<br/>
                • Ensure the photos are clear and all text is readable<br/>
                • Your license will be verified before vehicle pickup<br/>
                • You must bring the original license for verification
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full">
          Submit License Information
        </Button>
      </CardContent>
    </Card>
  );
};

export default LicenseUpload;
