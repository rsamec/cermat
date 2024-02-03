import React, { useState, useCallback } from 'react';
import { Option, cls } from '../../lib/utils/utils';
import withControl, { ValueProps } from './WithFormControl';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS as cssDndKit } from '@dnd-kit/utilities';

type SortableListProps = { options: Option<string>[] } & ValueProps<Option<string>[]>


function SortableItem({ option, activeId }: { option: Option<string>, activeId: UniqueIdentifier | null }) {
  const { value: id, name } = option;
  const { setNodeRef, transform, transition, listeners } = useSortable({ id });
  const style = {
    transform: cssDndKit.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      className={cls(['py-3 px-4 flex items-center gap-2 rounded-t-md text-sm text-left font-medium focus:z-10 border border-gray-200 text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600',
        (activeId === id) ? 'sortable-item dragging-dbd-kit' : 'sortable-item'])}
    >

      <div className="inline-flex self-start items-center gap-x-2">
        <span className='inline-flex self-start py-0.5 px-3 rounded-full font-medium text-white bg-gray-500'>{id}</span>
        <span dangerouslySetInnerHTML={{ __html: name }}></span>
      </div>

    </div>
  );
}

const SortableList = ({ items, onSortEnd }: { items: Option<string>[], onSortEnd: any }) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const getIndex = (id: UniqueIdentifier) => items.findIndex(d => d.value == id);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating.
      // Slight distance prevents sortable logic messing with
      // interactive elements in the handler toolbar component.
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement.
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      autoScroll={false}
      onDragStart={({ active }) => {
        if (active) {
          setActiveId(active.id);
        }
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id) {
          onSortEnd({
            oldIndex: getIndex(active.id),
            newIndex: getIndex(over.id),
          });
        }
        setActiveId(null);
      }}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={items.map((item) => item.value)} strategy={verticalListSortingStrategy}>
        <div className="sortable-list flex flex-col gap-2">
          {items.map((option, index) => (
            <SortableItem key={`item-${option.value}`} option={option} activeId={activeId} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export const DndKitList: React.FunctionComponent<SortableListProps> = ({ value, onChange, options }) => {

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
      onChange?.(arrayMove(value ?? options ?? [], oldIndex, newIndex));
    },
    [value, onChange, options]
  );

  return (<SortableList items={value ?? options ?? []} onSortEnd={onSortEnd} />);
}


export default withControl<Option<string>[], SortableListProps>(DndKitList);
