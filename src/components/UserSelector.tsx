import React, { useState } from 'react';
import { STATIC_USERS, User } from '../types/User';

export type Props = {
  users: User[];
  selectedUser: User | null;
  onSelect: (user: User | null) => void;
};

export const UserSelector: React.FC<Props> = ({ selectedUser, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      data-cy="UserSelector"
      className={`dropdown ${isOpen ? 'is-active' : ''}`}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => setIsOpen(prev => !prev)}
        >
          <span>{selectedUser ? selectedUser.name : 'Choose a user'}</span>
          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {STATIC_USERS.map((user: User) => (
            <a
              key={user.id}
              href={`#user-${user.id}`}
              className={`dropdown-item ${selectedUser?.id === user.id ? 'is-active' : ''}`}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                onSelect(user);
                setIsOpen(false);
              }}
            >
              {user.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
