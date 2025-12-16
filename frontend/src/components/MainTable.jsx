import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import EditExpenseModal from "./EditExpenseModal";

const MainTable = ({
  data = [],
  columns = [],
  onDelete,
  onEdit,
  noDataMessage = "No data found",
  isLoading = false,
}) => {
  const [editingItem, setEditingItem] = useState(null);

  const handleEditOpen = (item) => setEditingItem(item);
  const handleEditClose = () => setEditingItem(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
            {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {!isLoading &&
            data.map((item) => (
              <TableRow key={item.id}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(item) : item[col.key]}
                  </TableCell>
                ))}

                {(onEdit || onDelete) && (
                  <TableCell>
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-3"
                        onClick={() => handleEditOpen(item)}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={() => onDelete(item.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}

          {!isLoading && data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                className="text-center p-6 text-gray-500"
              >
                {noDataMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {editingItem && onEdit && (
        <EditExpenseModal
          expense={editingItem}
          onClose={handleEditClose}
          onUpdated={() => {
            handleEditClose();
            onEdit();
          }}
        />
      )}
    </>
  );
};

export default MainTable;
