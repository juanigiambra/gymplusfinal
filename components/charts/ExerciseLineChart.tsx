import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface ExerciseLineChartProps {
  labels: string[];
  data: number[];
  title?: string;
}

const ExerciseLineChart: React.FC<ExerciseLineChartProps> = ({ labels, data, title }) => {
  // Formatear las fechas a DD-MM
  const formattedLabels = labels.map(dateStr => {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}`;
  });
  return (
    <LineChart
      data={{
        labels: formattedLabels,
        datasets: [{ data }],
      }}
      width={Dimensions.get('window').width - 40}
      height={180}
      chartConfig={{
        backgroundColor: '#fff',
        backgroundGradientFrom: '#f7faff',
        backgroundGradientTo: '#f7faff',
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(53, 122, 232, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(53, 122, 232, ${opacity})`,
        style: { borderRadius: 16 },
        propsForDots: {
          r: '4',
          strokeWidth: '2',
          stroke: '#357ae8',
        },
      }}
      bezier
      style={{ marginVertical: 8, borderRadius: 16 }}
    />
  );
};

export default ExerciseLineChart;
