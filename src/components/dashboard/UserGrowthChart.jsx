import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = ['#1bd477', '#10b981', '#059669'];

const UserGrowthChart = ({ data = [], years = [], selectedYear, onYearChange }) => {
    
    return (
        <div className="bg-sidebar p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">User Growth</h2>
                {years.length > 0 && (
                    <Select onValueChange={onYearChange} value={selectedYear?.toString()}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
            <div className="h-[300px] w-full">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d3748" />
                            <XAxis 
                                dataKey="month" 
                                axisLine={false} 
                                tickLine={false}
                                tick={{ fill: '#a0aec0' }}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false}
                                tick={{ fill: '#a0aec0' }}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#2d3748', 
                                    border: '1px solid #4a5568',
                                    borderRadius: '0.5rem'
                                }}
                            />
                            <Legend />
                            <Bar
                                dataKey="users"
                                name="Users"
                                radius={[4, 4, 0, 0]}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        No data available for the selected year
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserGrowthChart;