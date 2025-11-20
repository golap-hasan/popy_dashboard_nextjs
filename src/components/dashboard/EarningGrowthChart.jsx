
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EarningGrowthChart = ({ data = [], yearlyTotal = 0, years = [], onYearChange, selectedYear }) => {
    
    return (
        <div className="bg-sidebar p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-semibold">Earning Growth</h2>
                    <p className="text-sm text-muted-foreground">
                        Yearly total{' '}
                        <span className="font-medium">৳{yearlyTotal?.toLocaleString()}</span>
                    </p>
                </div>
                {years.length > 0 && (
                    <Select onValueChange={onYearChange} value={selectedYear?.toString()}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years?.map((year) => (
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
                        <AreaChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1bd477" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#1bd477" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
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
                                tickFormatter={(value) => `৳${value.toLocaleString()}`}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#2d3748', 
                                    border: '1px solid #4a5568',
                                    borderRadius: '0.5rem'
                                }}
                                formatter={(value) => [`৳${value.toLocaleString()}`, 'Income']}
                            />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="income"
                                name="Income"
                                stroke="#1bd477"
                                fillOpacity={1}
                                fill="url(#colorIncome)"
                            />
                        </AreaChart>
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

export default EarningGrowthChart;
