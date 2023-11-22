import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskList from "./components/TaskList";
import '@testing-library/jest-dom';

global.fetch = jest.fn();

const mockFetchSuccess = (data) => {
  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data),
    })
  );
};

const mockFetchFailure = () => {
  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: false,
    })
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("TaskList Component", () => {
  test("renders without crashing", async () => {
    mockFetchSuccess([]);
    render(<TaskList />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
  });

  test("allows adding a task", async () => {
    mockFetchSuccess([]);
    mockFetchSuccess({ taskName: "New Task", Id: 1 });

    render(<TaskList />);
    const inputElement = screen.getByRole('textbox');
    const addButton = screen.getByText("Add task");

    fireEvent.change(inputElement, { target: { value: "New Task" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      const newTask = screen.getByText("New Task");
      expect(newTask).toBeInTheDocument();
    });
  });

  test("allows deleting a task", async () => {
    mockFetchSuccess([{ taskName: "Task 1", Id: 1 }]);
    mockFetchSuccess();

    render(<TaskList />);

    await waitFor(() => {
      const deleteButton = screen.getByText("Delete");
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(screen.queryByText("Task 1")).toBeNull();
    });
  });
});

