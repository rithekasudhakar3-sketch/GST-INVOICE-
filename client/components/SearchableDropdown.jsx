import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

export const SearchableDropdown = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Search...',
  error,
  required = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Find currently selected option
  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options based on search query
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update query when value changes
  useEffect(() => {
    if (selectedOption) {
      setSearchQuery('');
    }
  }, [value, selectedOption]);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`flex flex-col relative w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300 flex items-center">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-3 py-1.5 text-sm rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer transition-all
          ${error 
            ? 'border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
          }`}
      >
        <span className={selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-[100%] left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {/* Search box inside dropdown */}
          <div className="flex items-center px-3 py-2 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              autoFocus
              placeholder="Type to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-transparent text-gray-900 dark:text-white border-none outline-none focus:ring-0 focus:outline-none"
              onClick={(e) => e.stopPropagation()} // Prevent closing on input click
            />
          </div>

          <div className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`px-3 py-2 text-xs cursor-pointer transition-colors flex flex-col
                    ${opt.value === value
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  <span className="font-semibold">{opt.label}</span>
                  {opt.sublabel && (
                    <span className={`text-[10px] ${opt.value === value ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {opt.sublabel}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-2.5 text-xs text-gray-500 dark:text-gray-400 text-center">
                No matches found
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <span className="text-red-500 text-[10px] mt-0.5 font-medium">
          {error.message || error}
        </span>
      )}
    </div>
  );
};
