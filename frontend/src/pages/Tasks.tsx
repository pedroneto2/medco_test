import { useEffect, useState } from 'react';
import api from '../api';

interface Task {
  id: number;
  title: string;
  status: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchData = async () => {
    try {
      const res = await api.get('/user/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => { fetchData() }, []);

  return (
    <div>
      <h2>My Tasks</h2>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.title} {t.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
