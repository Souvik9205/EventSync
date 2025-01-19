{
  /* <main className="container mx-auto px-4 py-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Attendees
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-900">
                    {stats?.totalAttendees || 0}
                  </div>
                  <p className="text-xs text-gray-500">people registered</p>
                </CardContent>
              </Card>
  
              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Today's Attendance
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
  
              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Departments
                  </CardTitle>
                  <Users2 className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">
                    {stats?.uniqueDepartments || 0}
                  </div>
                  <p className="text-xs text-gray-500">unique departments</p>
                </CardContent>
              </Card>
  
              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Average Age
                  </CardTitle>
                  <BarChart className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-900">
                    {stats?.averageAge.toFixed(1)}
                  </div>
                  <p className="text-xs text-gray-500">years</p>
                </CardContent>
              </Card>
            </motion.div>
  
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-900">
                  Attendance Records
                </h2>
                <Button
                  variant="outline"
                  className="border-indigo-500 text-indigo-700 hover:bg-indigo-50"
                >
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>
  
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-indigo-50/60">
                        <TableHead className="py-4 px-6 text-left text-sm font-semibold text-indigo-900">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>Timestamp</span>
                          </div>
                        </TableHead>
                        {event?.customFields?.map((field) => (
                          <TableHead
                            key={field.id}
                            className="py-4 px-6 text-left text-sm font-semibold text-indigo-900"
                          >
                            {field.fieldName}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {event?.attendees?.map((attendee) => (
                        <TableRow
                          key={attendee.id}
                          className="hover:bg-gray-50 transition-colors"
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
  
              {event?.attendees.length === 0 && (
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
          </main> */
}
