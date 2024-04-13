import React, { useState } from 'react';

const TabComponent = () => {
  // Initialize state to keep track of the active tab
  const [activeTab, setActiveTab] = useState(1);

  // Define an array of tab content
  const tabContent = [
    {
      id: 1,
      title: 'Tab 1',
      content: 'Content for Tab 1',
    },
    {
      id: 2,
      title: 'Tab 2',
      content: 'Content for Tab 2',
    },
    {
      id: 3,
      title: 'Tab 3',
      content: 'Content for Tab 3',
    },
  ];

  return (
    <div className="max-w-md mx-auto mt-4 p-4 border rounded-lg">
      <ul className="flex border-b">
        {tabContent.map((tab) => (
          <li
            key={tab.id}
            className={`${
              activeTab === tab.id
                ? 'border-t-2 border-blue-500'
                : 'border-transparent'
            } -mb-px mr-1`}
          >
            <a
              href="#"
              className={`${
                activeTab === tab.id
                  ? 'bg-white text-blue-500'
                  : 'bg-gray-200 text-gray-500 hover:bg-white hover:text-blue-500'
              } py-2 px-4 inline-block`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab.id);
              }}
            >
              {tab.title}
            </a>
          </li>
        ))}
      </ul>
      <div className="p-4">
        {tabContent.map((tab) => (
          <div
            key={tab.id}
            className={`${
              activeTab === tab.id ? 'block' : 'hidden'
            } text-gray-700`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabComponent;