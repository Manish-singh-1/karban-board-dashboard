import React from "react";
import { Draggable } from "react-beautiful-dnd";
import Task from "./Task";

const Column = ({ columnId, tasks, onEditTask, onDeleteTask }) => {
  return (
    <div className="column">
      {tasks.map((task, index) => (
        <Draggable key={task.id} draggableId={task.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Task
                task={task}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
              />
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export default Column;