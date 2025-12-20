import { useNavigate } from "react-router-dom";

const AnalyticsView = () => {
  const navigate = useNavigate();

  const metrics = [
    { label: "Profile Views", value: "1,247", change: "+12%", period: "vs last week" },
    { label: "Total Bookings", value: "84", change: "+8%", period: "vs last week" },
    { label: "Conversion Rate", value: "6.7%", change: "+0.5%", period: "vs last week" },
    { label: "Avg Call Duration", value: "8.2 min", change: "-0.3 min", period: "vs last week" },
  ];

  const recentBookings = [
    { id: 1, fan: "Fan #1234", type: "Video", duration: "12 min", earnings: "$60" },
    { id: 2, fan: "Fan #5678", type: "Audio", duration: "5 min", earnings: "$15" },
    { id: 3, fan: "Fan #9012", type: "Video", duration: "8 min", earnings: "$40" },
  ];

  return (
    <div className="min-h-screen bg-muted p-4">
      {/* Header */}
      <div className="border-2 border-dashed border-border bg-background p-4 mb-4">
        <div className="flex items-center justify-between">
          <span 
            className="text-sm text-muted-foreground cursor-pointer"
            onClick={() => navigate("/creator-hub")}
          >
            [← Back]
          </span>
          <span className="font-medium">[Analytics]</span>
          <span className="text-sm text-muted-foreground">[Export]</span>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex gap-2 mb-4">
        {["Today", "This Week", "This Month", "All Time"].map((period, index) => (
          <div
            key={period}
            className={`border-2 border-dashed px-3 py-2 text-xs flex-1 text-center ${
              index === 1 ? "border-primary bg-primary/10" : "border-border bg-background"
            }`}
          >
            [{period}]
          </div>
        ))}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="border-2 border-dashed border-border bg-background p-4"
          >
            <p className="text-xs text-muted-foreground">[{metric.label}]</p>
            <p className="text-2xl font-bold mt-1">{metric.value}</p>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={metric.change.startsWith("+") ? "text-green-600" : "text-red-500"}>
                {metric.change}
              </span>
              {" "}{metric.period}
            </p>
          </div>
        ))}
      </div>

      {/* Views Chart Placeholder */}
      <div className="border-2 border-dashed border-border bg-background p-4 mb-4">
        <p className="font-medium mb-3">[Profile Views Over Time]</p>
        <div className="h-32 border-2 border-dashed border-border flex items-end justify-around p-2">
          {[40, 65, 45, 80, 55, 90, 70].map((height, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div
                className="w-6 bg-foreground/20 border border-dashed border-border"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-muted-foreground">
                {["M", "T", "W", "T", "F", "S", "S"][index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bookings Chart Placeholder */}
      <div className="border-2 border-dashed border-border bg-background p-4 mb-4">
        <p className="font-medium mb-3">[Bookings by Type]</p>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 border-2 border-dashed border-border rounded-full flex items-center justify-center">
            [Pie Chart]
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-dashed border-border bg-foreground/30" />
              <span className="text-sm">[Video Calls: 65%]</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-dashed border-border bg-foreground/10" />
              <span className="text-sm">[Audio Calls: 35%]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="border-2 border-dashed border-border bg-background p-4 mb-4">
        <p className="font-medium mb-3">[Earnings Summary]</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="border border-dashed border-border p-3">
            <p className="text-xs text-muted-foreground">[Today]</p>
            <p className="font-bold">$115</p>
          </div>
          <div className="border border-dashed border-border p-3">
            <p className="text-xs text-muted-foreground">[This Week]</p>
            <p className="font-bold">$842</p>
          </div>
          <div className="border border-dashed border-border p-3">
            <p className="text-xs text-muted-foreground">[This Month]</p>
            <p className="font-bold">$3,256</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="border-2 border-dashed border-border bg-background p-4 mb-4">
        <p className="font-medium mb-3">[Recent Bookings]</p>
        <div className="space-y-2">
          {recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="border border-dashed border-border p-3 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium">[{booking.fan}]</p>
                <p className="text-xs text-muted-foreground">
                  [{booking.type}] • [{booking.duration}]
                </p>
              </div>
              <p className="font-bold">{booking.earnings}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 text-center text-sm text-muted-foreground">
          [View All Bookings →]
        </div>
      </div>

      {/* Navigation Links */}
      <div className="space-y-2">
        <div 
          onClick={() => navigate("/creator-hub")}
          className="border-2 border-dashed border-border bg-background p-3 text-center cursor-pointer hover:bg-muted"
        >
          [← Back to Creator Hub]
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
