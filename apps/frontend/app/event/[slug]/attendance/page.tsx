"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Download,
  RefreshCcw,
  ArrowUpDown,
  UserCheck,
  Timer,
  Users2,
  CheckCircle2,
  XCircle,
  Verified,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BACKEND_URL } from "@/app/secret";
import { EventLoadingState } from "@/app/_components/Loading";
import { EventNotFound } from "@/app/_components/NotEvent";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useAuthCheck } from "@/lib/authCheck";

function AttendanceDetails() {
  const eventId = useParams().slug as string;
  const token = localStorage.getItem("token");
  const [event, setEvent] = useState<EventAttendees | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useAuthCheck();
  const fetchEventData = async () => {
    if (token) {
      try {
        const response = await fetch(
          `${BACKEND_URL}/event/attendence/${eventId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        setEvent(result.event);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };
  useEffect(() => {
    if (token && eventId) {
      fetchEventData();
    }
  }, [eventId, token]);

  const handleExport = () => {
    if (!event || !event.attendees || !event.customFields) return;

    // Create worksheet data
    const worksheetData = event.attendees.map((attendee) => {
      const row: Record<string, string | number | boolean | Date | null> = {
        Timestamp: new Date(attendee.timestamp).toLocaleString(),
      };

      // Add custom fields
      event.customFields.forEach((field) => {
        row[field.fieldName] = attendee.fields[field.fieldName] || "";
      });

      return row;
    });

    // Create workbook and add worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(worksheetData);

    // Auto-size columns
    const colWidths = Object.keys(worksheetData[0] || {}).map((key) => ({
      wch: Math.max(
        key.length,
        ...worksheetData.map((row) => String(row[key] || "").length)
      ),
    }));
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Records");

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Generate filename with event details and date
    const fileName = `attendance_records_${new Date().toISOString().split("T")[0]}.xlsx`;

    // Save file
    saveAs(data, fileName);
  };
  const getStats = () => {
    if (!event) return null;

    const totalRegistered = event.attendees.length;
    const verifiedAttendees = event.attendees.filter((a) => a.verified).length;
    const verifiedPercentage =
      totalRegistered > 0
        ? Math.round((verifiedAttendees / totalRegistered) * 100)
        : 0;
    const today = new Date().toISOString().split("T")[0];
    const todayAttendees = event.attendees.filter(
      (a) => a.timestamp.split("T")[0] === today
    ).length;

    const timestamps = event.attendees.map((a) =>
      new Date(a.timestamp).getTime()
    );
    const timeIntervals = timestamps
      .slice(1)
      .map((time, i) => time - timestamps[i]);
    const avgTimeBetweenCheckins = timeIntervals.length
      ? (Math.max(...timestamps) - Math.min(...timestamps)) /
        timeIntervals.length
      : 0;

    // Calculate peak check-in hour
    const hours = event.attendees.map((a) => new Date(a.timestamp).getHours());
    const hourCounts = hours.reduce(
      (acc, hour) => {
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );
    // const peakHour = Object.entries(hourCounts).reduce(
    //   (a, b) => (hourCounts[Number(a[0])] > hourCounts[Number(b[0])] ? a : b),
    //   ["0", 0]
    // )[0];
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      count: hourCounts[i] || 0,
    }));

    const timelineData = event.attendees.reduce(
      (acc, attendee) => {
        const date = new Date(attendee.timestamp).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const sortedTimelineData = Object.entries(timelineData)
      .sort(
        ([dateA], [dateB]) =>
          new Date(dateA).getTime() - new Date(dateB).getTime()
      )
      .map(([date, count]) => ({
        date,
        count,
      }));

    return {
      totalAttendees: totalRegistered,
      todayAttendees,
      verifiedPercentage,
      avgCheckinInterval: Math.floor(avgTimeBetweenCheckins / (1000 * 60)),
      hourlyData,
      timelineData: sortedTimelineData,
    };
  };

  const stats = getStats();

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEventData();
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const sortedAttendees = event?.attendees
    ? [...event.attendees].sort((a, b) => {
        const comparison =
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        return sortOrder === "asc" ? comparison : -comparison;
      })
    : [];

  if (loading) return <EventLoadingState />;
  if (!event) return <EventNotFound />;

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-white hover:shadow-lg transition-shadow duration-500 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Attendees
            </CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">
              {stats?.totalAttendees || 0}
            </div>
            <p className="text-xs text-gray-500">people registered</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow duration-500 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Today&apos;s Attendance
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-900">
              {stats?.todayAttendees || 0}
            </div>
            <p className="text-xs text-gray-500">checked in today</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow duration-500 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Avg. Check-in Interval
            </CardTitle>
            <Timer className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {stats?.avgCheckinInterval || 0}
            </div>
            <p className="text-xs text-gray-500">minutes between check-ins</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow duration-500 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Verified Attendees
            </CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">
              {stats?.verifiedPercentage || 0}%
            </div>
            <p className="text-xs text-gray-500">of total attendees</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-emerald-900">
            Attendance Records
          </h2>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-emerald-500 text-emerald-700 hover:bg-emerald-50"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCcw
                className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              className="border-emerald-500 text-emerald-700 hover:bg-emerald-50"
              onClick={handleExport}
              disabled={!event?.attendees?.length}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <TableHeader>
                <TableRow className="bg-emerald-50/60">
                  <TableHead
                    className="py-4 px-6 text-left text-sm font-semibold text-emerald-900 cursor-pointer hover:bg-emerald-50"
                    onClick={toggleSort}
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Timestamp</span>
                      <ArrowUpDown className="h-4 w-4 ml-2" />
                    </div>
                  </TableHead>
                  {event?.customFields?.map((field) => (
                    <TableHead
                      key={field.id}
                      className="py-4 px-6 text-left text-sm font-semibold text-emerald-900"
                    >
                      {field.fieldName}
                    </TableHead>
                  ))}
                  <TableHead className="py-4 px-6 text-left text-sm font-semibold text-emerald-900 flex items-center space-x-2">
                    <Verified className="h-4 w-4" />
                    <span>Verification</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAttendees.map((attendee) => (
                  <TableRow
                    key={attendee.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      attendee.verified ? "bg-emerald-50/30" : "bg-red-50/30"
                    }`}
                  >
                    <TableCell className="py-4 px-6 text-sm font-medium text-gray-900">
                      {new Date(attendee.timestamp).toLocaleString()}
                    </TableCell>
                    {event?.customFields?.map((field) => (
                      <TableCell
                        key={field.id}
                        className="py-4 px-6 text-sm text-gray-500"
                      >
                        {attendee.fields[field.fieldName]}
                      </TableCell>
                    ))}
                    <TableCell className="py-4 px-6 text-sm">
                      {attendee.verified ? (
                        <div className="flex items-center text-emerald-600">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Verified
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <XCircle className="h-4 w-4 mr-2" />
                          Not Verified
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </table>
          </div>
        </div>

        {sortedAttendees.length === 0 && (
          <div className="text-center py-12">
            <Users2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No attendees yet
            </h3>
            <p className="text-gray-500">
              Share the QR code to start collecting attendance.
            </p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Timeline Chart */}
        <Card className="bg-white md:p-6 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Check-ins Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats?.timelineData}
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Check-ins"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hourly Distribution Chart */}
        <Card className="bg-white md:p-6 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Hourly Check-in Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.hourlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="count"
                  name="Check-ins"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default AttendanceDetails;
