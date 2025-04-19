import React, { useState } from 'react';
import { useBackup } from '../../hooks/useBackup';
import { format } from 'date-fns';
import { Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function BackupPanel() {
  const { loading, error, createBackup } = useBackup();
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleCreateBackup = async () => {
    try {
      const backup = await createBackup();
      
      // Download backup file
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${format(backup.timestamp, 'yyyy-MM-dd-HH-mm')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus({
        type: 'success',
        message: 'Backup created and downloaded successfully'
      });
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to create backup'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Backup & Recovery</h2>
      </div>

      {(status.type || error) && (
        <div className={`p-4 rounded-lg ${
          status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {status.type === 'success' ? (
            <CheckCircle className="w-5 h-5 inline-block mr-2" />
          ) : (
            <AlertTriangle className="w-5 h-5 inline-block mr-2" />
          )}
          {status.message || error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Create Backup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Create a backup of your data and download it as a file. You can use this file to restore your data later if needed.
            </p>
            <button
              onClick={handleCreateBackup}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              <Database className="w-4 h-4" />
              <span>{loading ? 'Creating backup...' : 'Create & Download Backup'}</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}