export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export const STATIC_USERS: User[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    email: 'leanne.graham@example.com',
    phone: '123-456-7890',
  },
  {
    id: 2,
    name: 'Ervin Howell',
    email: 'ervin.howell@example.com',
    phone: '234-567-8901',
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    email: 'clementine.bauch@example.com',
    phone: '345-678-9012',
  },
  {
    id: 4,
    name: 'Patricia Lebsack',
    email: 'patricia.lebsack@example.com',
    phone: '456-789-0123',
  },
  {
    id: 5,
    name: 'Chelsey Dietrich',
    email: 'chelsey.dietrich@example.com',
    phone: '567-890-1234',
  },
];
