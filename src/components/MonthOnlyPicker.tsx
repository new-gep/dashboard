import React, { useState } from 'react';
import { Calendar } from 'react-date-range';
import ptBR from 'date-fns/locale/pt-BR';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

interface MonthOnlyPickerProps {
  onChange: (date: Date) => void;
  selectedDate: Date;
}

const MonthOnlyPicker: React.FC<MonthOnlyPickerProps> = ({ onChange, selectedDate }) => {
  const [shownDate, setShownDate] = useState(selectedDate);

  const handleMonthChange = (date: Date) => {
    setShownDate(date);
    onChange(date);
  };

  return (
    <Calendar
      date={shownDate}
      onChange={handleMonthChange}
      showMonthAndYearPickers={true}
      showMonthArrow={false}
      showDateDisplay={false}
      locale={ptBR}
      monthDisplayFormat="MMMM YYYY"
      shownDate={shownDate}
      onShownDateChange={handleMonthChange}
    />
  );
};

export default MonthOnlyPicker; 