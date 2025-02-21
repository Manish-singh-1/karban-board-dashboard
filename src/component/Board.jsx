import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Column from "./Column";
import { v4 as uuid } from "uuid";

const Board = () => {
  const [columns, setColumns] = useState({
    "To-Do": [],
    "In Progress": [],
    Done: [],
  });

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("kanban-board"));
    if (savedState) setColumns(savedState);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem("kanban-board", JSON.stringify(columns));
  }, [columns]);

  // Add a new task
  const addTask = (columnId) => {
    const newTask = {
      id: uuid(),
      title: "New Task",
      description: "Description",
      dueDate: new Date().toISOString().split("T")[0],
    };
    setColumns({
      ...columns,
      [columnId]: [...columns[columnId], newTask],
    });
  };

  // Edit a task
  const editTask = (updatedTask) => {
    const updatedColumns = Object.keys(columns).reduce((acc, columnId) => {
      acc[columnId] = columns[columnId].map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      return acc;
    }, {});
    setColumns(updatedColumns);
  };

  // Delete a task
  const deleteTask = (taskId) => {
    const updatedColumns = Object.keys(columns).reduce((acc, columnId) => {
      acc[columnId] = columns[columnId].filter((task) => task.id !== taskId);
      return acc;
    }, {});
    setColumns(updatedColumns);
  };

  // Handle drag-and-drop
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If dropped outside the list
    if (!destination) return;

    // If dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the source and destination columns
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    // Remove the task from the source column
    const [removed] = sourceColumn.splice(source.index, 1);

    // If dropped in the same column
    if (source.droppableId === destination.droppableId) {
      sourceColumn.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: sourceColumn,
      });
    } else {
      // If dropped in a different column
      destColumn.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board">
        {Object.keys(columns).map((columnId) => (
          <div key={columnId} className="column-container">
            <h2>{columnId}</h2>
            <button style={{ marginLeft: "5rem" }} onClick={() => addTask(columnId)}>
              Add Task
            </button>
            <Droppable droppableId={columnId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Column
                    columnId={columnId}
                    tasks={columns[columnId]}
                    onEditTask={editTask}
                    onDeleteTask={deleteTask}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;