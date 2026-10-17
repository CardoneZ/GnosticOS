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
  initialDraft?: Partial<JournalEntryData> | null;
  onClearDraft?: () => void;
}

export const JournalWorkbench: React.FC<JournalWorkbenchProps> = ({
  entities,
  tunnels,
  initialDraft,
  onClearDraft,
}) => {
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntryData | null>(null);

  // If an initial draft is passed (e.g. from Hermetica or Chaos sigils), open editor immediately
  useEffect(() => {
    if (initialDraft) {
      const syntheticEntry: JournalEntryData = {
        id: crypto.randomUUID ? crypto.randomUUID() : `draft-${Date.now()}`,
        ritual_at: new Date().toISOString(),
        tz_offset_min: new Date().getTimezoneOffset(),
        title: initialDraft.title || 'Hermetic Contemplation',
        body_md: initialDraft.body_md || '',
        working_type: initialDraft.working_type || 'meditation',
        pre_state_label: initialDraft.pre_state_label || 'Contemplative Openness',
        post_state_label: initialDraft.post_state_label || 'Hermetic Gnosis',
        resonance: initialDraft.resonance ?? 8,
        offerings: initialDraft.offerings || [],
        entities: initialDraft.entities || [],
        meditation_record: initialDraft.meditation_record || null,
      };
      setEditingEntry(syntheticEntry);
      setIsEditing(true);
      onClearDraft?.();
    }
  }, [initialDraft, onClearDraft]);

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
      onRefreshEntries={loadEntries}
    />
  );
};

export default JournalWorkbench;
