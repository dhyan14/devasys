'use client';

import React from 'react';

export default function EditFacultyPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Faculty</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <p>Edit form for faculty ID: {params.id}</p>
      </div>
    </div>
  );
} 