import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Camera, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface InspectionItem {
  id: string;
  category: string;
  item: string;
  status: 'good' | 'damaged' | 'noted';
  notes?: string;
}

const VehicleInspection = ({ bookingId, onComplete }: { bookingId: string; onComplete: (data: any) => void }) => {
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([
    // Exterior
    { id: 'exterior_1', category: 'Exterior', item: 'Front bumper', status: 'good' },
    { id: 'exterior_2', category: 'Exterior', item: 'Rear bumper', status: 'good' },
    { id: 'exterior_3', category: 'Exterior', item: 'Left side mirrors', status: 'good' },
    { id: 'exterior_4', category: 'Exterior', item: 'Right side mirrors', status: 'good' },
    { id: 'exterior_5', category: 'Exterior', item: 'Windshield', status: 'good' },
    { id: 'exterior_6', category: 'Exterior', item: 'Rear windshield', status: 'good' },
    { id: 'exterior_7', category: 'Exterior', item: 'Left front tire', status: 'good' },
    { id: 'exterior_8', category: 'Exterior', item: 'Right front tire', status: 'good' },
    { id: 'exterior_9', category: 'Exterior', item: 'Left rear tire', status: 'good' },
    { id: 'exterior_10', category: 'Exterior', item: 'Right rear tire', status: 'good' },
    
    // Interior
    { id: 'interior_1', category: 'Interior', item: 'Driver seat', status: 'good' },
    { id: 'interior_2', category: 'Interior', item: 'Passenger seat', status: 'good' },
    { id: 'interior_3', category: 'Interior', item: 'Rear seats', status: 'good' },
    { id: 'interior_4', category: 'Interior', item: 'Dashboard', status: 'good' },
    { id: 'interior_5', category: 'Interior', item: 'Steering wheel', status: 'good' },
    { id: 'interior_6', category: 'Interior', item: 'Gear shift', status: 'good' },
    { id: 'interior_7', category: 'Interior', item: 'Air conditioning', status: 'good' },
    { id: 'interior_8', category: 'Interior', item: 'Radio/Entertainment system', status: 'good' },
    
    // Engine & Mechanical
    { id: 'mechanical_1', category: 'Mechanical', item: 'Engine start', status: 'good' },
    { id: 'mechanical_2', category: 'Mechanical', item: 'Brakes', status: 'good' },
    { id: 'mechanical_3', category: 'Mechanical', item: 'Lights (headlights)', status: 'good' },
    { id: 'mechanical_4', category: 'Mechanical', item: 'Lights (taillights)', status: 'good' },
    { id: 'mechanical_5', category: 'Mechanical', item: 'Turn signals', status: 'good' },
    { id: 'mechanical_6', category: 'Mechanical', item: 'Horn', status: 'good' },
    { id: 'mechanical_7', category: 'Mechanical', item: 'Wipers', status: 'good' },
    { id: 'mechanical_8', category: 'Mechanical', item: 'Fuel level', status: 'good' },
  ]);

  const [photos, setPhotos] = useState<string[]>([]);

  const updateItemStatus = (id: string, status: 'good' | 'damaged' | 'noted', notes?: string) => {
    setInspectionItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status, notes } : item
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'damaged':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'noted':
        return <FileText className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return <Badge className="bg-green-100 text-green-800">Good</Badge>;
      case 'damaged':
        return <Badge className="bg-red-100 text-red-800">Damaged</Badge>;
      case 'noted':
        return <Badge className="bg-yellow-100 text-yellow-800">Noted</Badge>;
      default:
        return null;
    }
  };

  const groupedItems = inspectionItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, InspectionItem[]>);

  const handleComplete = () => {
    const inspectionData = {
      bookingId,
      items: inspectionItems,
      photos,
      completedAt: new Date().toISOString(),
      inspectedBy: 'Customer'
    };
    
    onComplete(inspectionData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Vehicle Inspection Checklist</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-3">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(item.status)}
                      <span className="text-sm">{item.item}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(item.status)}
                      <div className="flex space-x-1">
                        <Button
                          variant={item.status === 'good' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateItemStatus(item.id, 'good')}
                        >
                          ✓
                        </Button>
                        <Button
                          variant={item.status === 'damaged' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateItemStatus(item.id, 'damaged')}
                        >
                          ✗
                        </Button>
                        <Button
                          variant={item.status === 'noted' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateItemStatus(item.id, 'noted')}
                        >
                          !
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Damage Notes */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Damage Notes</h3>
            <div className="space-y-3">
              {inspectionItems.filter(item => item.status !== 'good').map((item) => (
                <div key={item.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{item.item}</span>
                    {getStatusBadge(item.status)}
                  </div>
                  <textarea
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Describe the damage or issue..."
                    value={item.notes || ''}
                    onChange={(e) => updateItemStatus(item.id, item.status, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Photos Section */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Inspection Photos</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">Take photos of any damages or issues</p>
              <Button variant="outline" className="mt-2">
                Add Photos
              </Button>
            </div>
          </div>

          {/* Complete Inspection */}
          <div className="flex justify-end">
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              Complete Inspection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleInspection;
