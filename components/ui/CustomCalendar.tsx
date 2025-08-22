import React from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { StyleSheet } from 'react-native';

LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Sepiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
};
LocaleConfig.defaultLocale = 'es';

interface CustomCalendarProps {
  markedDates: any;
  style?: any;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ markedDates, style }) => {
  return (
    <Calendar
      markedDates={markedDates}
      theme={{
        backgroundColor: '#fff',
        calendarBackground: '#fff',
        textSectionTitleColor: '#357ae8',
        selectedDayBackgroundColor: '#357ae8',
        selectedDayTextColor: '#fff',
        todayTextColor: '#e83535',
        dayTextColor: '#222',
        arrowColor: '#357ae8',
        dotColor: '#357ae8',
      }}
      style={[styles.calendar, style]}
    />
  );
};

const styles = StyleSheet.create({
  calendar: {
    marginTop: 12,
    borderRadius: 12,
    width: 340,
    elevation: 2,
    shadowColor: '#357ae8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    backgroundColor: '#fff',
  },
});

export default CustomCalendar;
