'use client';

import React from 'react';
import { EquipmentItem } from '@/types';
import { Wrench, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface EquipmentTabProps {
  equipmentList: EquipmentItem[];
  onToggleStatus: (id: string, newStatus: EquipmentItem['status']) => void;
}

export function EquipmentTab({ equipmentList, onToggleStatus }: EquipmentTabProps) {
  const operationalCount = equipmentList.filter((e) => e.status === 'operational').length;
  const maintenanceCount = equipmentList.filter((e) => e.status === 'needs_service').length;
  const downCount = equipmentList.filter((e) => e.status === 'out_of_order').length;

  return (
    <div className="space-y-4">
      {/* Equipment Health Summary */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100">{operationalCount}</div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">Fully Operational Stations</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100">{maintenanceCount}</div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">Service Due / Cable Wear</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100">{downCount}</div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">Out of Order / Technician Needed</div>
          </div>
        </div>
      </div>

      {/* Equipment Register Table */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-xs overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Gym Machinery & Maintenance Register ({equipmentList.length})
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Track cable pulleys, treadmills, upholstery, and maintenance schedules
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <Wrench className="h-3.5 w-3.5" />
            Equipment Registry
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-200 bg-zinc-50 font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-300">
              <tr>
                <th className="py-2.5 px-4">Equipment Name</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Tier Availability</th>
                <th className="py-2.5 px-4">Last Serviced</th>
                <th className="py-2.5 px-4">Next Due Date</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Notes / Issue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {equipmentList.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                  style={{ height: '44px' }}
                >
                  <td className="py-2.5 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.name}
                  </td>
                  <td className="py-2.5 px-4 capitalize text-zinc-700 dark:text-zinc-300">
                    {item.category.replace('_', ' ')}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="font-mono uppercase text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                      {item.tier.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-zinc-700 dark:text-zinc-300">
                    {item.lastServicedDate}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-zinc-700 dark:text-zinc-300">
                    {item.nextServiceDueDate}
                  </td>
                  <td className="py-2.5 px-4">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        onToggleStatus(item.id, e.target.value as EquipmentItem['status'])
                      }
                      className={`rounded px-2.5 py-1 text-xs font-semibold uppercase tracking-wider outline-none cursor-pointer transition-colors ${
                        item.status === 'operational'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.status === 'needs_service'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      <option value="operational">Operational</option>
                      <option value="needs_service">Needs Service</option>
                      <option value="out_of_order">Out of Order</option>
                    </select>
                  </td>
                  <td className="py-2.5 px-4 text-zinc-700 dark:text-zinc-300 max-w-xs truncate">
                    {item.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
