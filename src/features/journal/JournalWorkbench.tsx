import React, { useState, useEffect } from 'react';
import {
  JournalEntryData,
  EntityData,
  TunnelData,
  fetchJournalEntries,
  saveJournalEntry,
  deleteJournalEntry,
} from '../../platform/vault';
import JournalList from './JournalList';
import JournalEntryForm from './JournalEntryForm';

interface JournalWorkbenchProps {
  entities: EntityData[];
  tunnels: TunnelData[];
}

export const JournalWorkbench: React.FC<JournalWorkbenchProps> = ({
  entities,
  tunnels,
}) => {
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntryData | null>(null);

  const loadEntries = async () => {
    const list = await fetchJournalEntries();
    setEntries(list);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSave = async (entry: JournalEntryData) => {
    await saveJournalEntry(entry);
    await loadEntries();
    setIsEditing(false);
    setEditingEntry(null);
  };

  const handleDelete = async (id: string) => {
    await deleteJournalEntry(id);
    await loadEntries();
  };

  const handleNew = () => {
    setEditingEntry(null);
    setIsEditing(true);
  };

  const handleEdit = (entry: JournalEntryData) => {
    setEditingEntry(entry);
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <JournalEntryForm
        initialEntry={editingEntry}
        entities={entities}
        tunnels={tunnels}
        onSave={handleSave}
        onCancel={() => {
          setIsEditing(false);
          setEditingEntry(null);
        }}
      />
    );
  }

  return (
    <JournalList
      entries={entries}
      entities={entities}
      tunnels={tunnels}
      onNewEntry={handleNew}
      onEditEntry={handleEdit}
      onDeleteEntry={handleDelete}
    />
  );
};

export default JournalWorkbench;
