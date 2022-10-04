import axios from 'axios';
import { useRef, useState } from 'react';
import './App.css';
import useDebounce from './hooks/useDebounce';
import useHover from './hooks/useHover';
import useInput from './hooks/useInput';
import useRequest from './hooks/useRequest';
import useScroll from './hooks/useScroll.js';

const Request = () => {
  const [todos, loading, error] = useRequest(fetchTodo);

  function fetchTodo() {
    return axios.get(`https://jsonplaceholder.typicode.com/todos?_limit=5`);
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    console.log(error);
    return <h1>Error</h1>;
  }

  return (
    <div>
      {todos &&
        todos.map((todo) => (
          <div
            style={{
              margin: '0.5rem 0',
              padding: '0.5rem',
              border: '1px solid tomato',
            }}
            key={todo.id}
          >
            {todo.id} {todo.title}
          </div>
        ))}
    </div>
  );
};

const SearchBlock = () => {
  const [value, setValue] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  function search(query) {
    fetch(`https://jsonplaceholder.typicode.com/todos?query=` + query)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
      });
  }

  const onChange = (e) => {
    setValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  return <input type="text" value={value} onChange={onChange} />;
};

const List = () => {
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 20;
  const childRef = useRef();
  const intersected = useScroll(childRef, () => fetchTodos(page, limit));

  function fetchTodos(page, limit) {
    fetch(
      `https://jsonplaceholder.typicode.com/todos?_limit=${limit}&_page=${page}`
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.length === 0) {
          return;
        }
        setTodos((prev) => [...prev, ...json]);
        setPage((prev) => prev + 1);
      });
  }

  return (
    <div>
      {todos.map((todo) => (
        <div
          style={{
            margin: '0.5rem 0',
            padding: '0.5rem',
            border: '1px solid tomato',
          }}
          key={todo.id}
        >
          {todo.id} {todo.title}
        </div>
      ))}
      <div ref={childRef} style={{ height: '20px', backgroundColor: 'gray' }} />
    </div>
  );
};

const Hover = () => {
  const ref = useRef();
  const isHovering = useHover(ref);

  return (
    <div
      ref={ref}
      style={{
        width: '300px',
        height: '300px',
        backgroundColor: isHovering ? 'tomato' : 'wheat',
      }}
    >
      <button onClick={() => console.log(ref.current)}>Click me</button>
    </div>
  );
};

const Input = () => {
  const username = useInput('');
  const userPhone = useInput('');
  return (
    <>
      <input type="text" {...username} />
      <input type="text" {...userPhone} />
    </>
  );
};

function App() {
  return (
    <div className="App">
      <div style={{ padding: '1rem 0' }}>
        <Request />
      </div>
      <div style={{ padding: '1rem 0' }}>
        <SearchBlock />
      </div>
      <div style={{ padding: '1rem 0' }}>
        <Input />
      </div>
      <div style={{ padding: '1rem 0' }}>
        <Hover />
      </div>
      <div style={{ padding: '1rem 0' }}>
        <List />
      </div>
    </div>
  );
}

export default App;
