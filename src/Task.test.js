import { render, screen, fireEvent } from "@testing-library/react";
import Task from "./components/Task";
import '@testing-library/jest-dom';

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Task Component", () => {
  const mockTaskName = "Test Task";
  const mockTaskId = 1;
  const mockDeleteFunction = jest.fn();

  test("renders task with provided props", () => {
    render(<Task taskName={mockTaskName} taskId={mockTaskId} onDelete={mockDeleteFunction} />);

    const taskElement = screen.getByText(mockTaskName);
    expect(taskElement).toBeInTheDocument();
  });

  test("completes task on button click", () => {
    global.fetch.mockResolvedValue({ json: () => Promise.resolve({}) });

    render(<Task taskName={mockTaskName} taskId={mockTaskId} onDelete={mockDeleteFunction} />);
    const completeButton = screen.getByText("Complete");
    fireEvent.click(completeButton);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://localhost:7140/api/Task/${mockTaskId}`,
      expect.objectContaining({
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          isCompleted: true
        })
      })
    );
  });

  test("triggers delete function on button click", () => {
    render(<Task taskName={mockTaskName} taskId={mockTaskId} onDelete={mockDeleteFunction} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    expect(mockDeleteFunction).toHaveBeenCalledWith(mockTaskId);
  });
});

