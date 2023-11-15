import { gql } from "@apollo/client"
import { queries as teamQueries } from "common/team/graphql"

const detailFields = teamQueries.detailFields
const allUsers = teamQueries.allUsers
const users = teamQueries.users

const userFields = `
  _id
  username
  email
  employeeId
  details {
    avatar
    fullName
    firstName
    lastName
    position
  }
  departments {
    title
  }
  branches {
    title
  }
`

const attachmentFields = `
  url
  name
  type
  size
  duration
`

const listParamsDef = `
  $page: Int
  $perPage: Int
  $startDate: Date
  $endDate: Date
  $userIds: [String]
  $branchIds: [String]
  $departmentIds: [String]
  $reportType: String
  $scheduleStatus: String
  $isCurrentUserAdmin: Boolean
  $searchValue: String
`

const listParamsValue = `
  page: $page
  perPage: $perPage
  startDate: $startDate
  endDate: $endDate
  userIds: $userIds
  branchIds: $branchIds
  departmentIds: $departmentIds
  reportType: $reportType
  scheduleStatus: $scheduleStatus
  isCurrentUserAdmin: $isCurrentUserAdmin
  searchValue: $searchValue
`

const timelogsMain = gql`
  query timelogsMain(${listParamsDef}){
    timelogsMain(${listParamsValue}){
      list{
        _id
        user {
          ${userFields}
        }
        timelog
        deviceName
      }
      totalCount
    }
  }`

const timeclocksMain = gql`
  query timeclocksMain(${listParamsDef}) {
    timeclocksMain(${listParamsValue}) {
      list {
            _id
            shiftStart
            shiftEnd
            shiftActive
            user {
              ${userFields}
            }
            employeeUserName
            branchName
            employeeId
            deviceName
            deviceType
            inDevice
            inDeviceType  
            outDevice
            outDeviceType
        }
        totalCount
    }
}
`

const timeclocksPerUser = `
  query timeclocksPerUser($userId: String, $startDate: String, $endDate: String){
    timeclocksPerUser(userId: $userId, startDate: $startDate, endDate: $endDate){
      _id
      shiftStart
      shiftEnd
      shiftActive
    }
  }
`

const schedulesMain = gql`
  query schedulesMain(${listParamsDef}) {
    schedulesMain(${listParamsValue}) {
      list {
          _id
          shifts{
            _id
            shiftStart
            shiftEnd
            solved
            status
            scheduleConfigId
            lunchBreakInMins
            scheduleId
          }
          scheduleConfigId
          solved
          status
          user {
            ${userFields}
          }
          scheduleChecked
          submittedByAdmin
          totalBreakInMins
        }
        totalCount
  }
}
`

const checkDuplicateScheduleShifts = `
  query checkDuplicateScheduleShifts(${listParamsDef}) {
    checkDuplicateScheduleShifts(${listParamsValue}) {
      list {
          _id
          shifts{
            _id
            shiftStart
            shiftEnd
            solved
            status
            scheduleConfigId
          }
          scheduleConfigId
          solved
          status
          user {
            ${userFields}
          }
          scheduleChecked
          submittedByAdmin
          totalBreakInMins
        }
        totalCount
  }
}
`
const requestsMain = gql`
  query requestsMain(${listParamsDef}) {
    requestsMain(${listParamsValue}) {
      list {
          _id
          startTime
          endTime
          reason
          explanation
          solved
          status
          user {
            ${userFields}
          }
          attachment{
            ${attachmentFields}
          }
          absenceTimeType
          requestDates
          totalHoursOfAbsence
          note
        }
        totalCount
  }
}
`

const branches = `
  query branches($searchValue: String){
    branches(searchValue: $searchValue){
      _id
      title
    }
  }
`

const timeclockReports = gql`
  query timeclockReports(${listParamsDef}){
    timeclockReports(${listParamsValue}){
      list {
              groupTitle
            groupReport{
              user {
                ${userFields}
              }
              scheduleReport {
                timeclockDate
                timeclockStart
                timeclockEnd
                timeclockDuration
            
                deviceName
                deviceType
                
                inDevice
                inDeviceType
                outDevice
                outDeviceType

                scheduledStart
                scheduledEnd
                scheduledDuration
                
                lunchBreakInHrs

                totalMinsLate
                totalHoursOvertime
                totalHoursOvernight
              }

              branchTitles
              departmentTitles
              
              totalMinsLate
              totalAbsenceMins
              totalMinsWorked
              totalMinsScheduled

              totalRegularHoursWorked
              totalHoursWorked
              totalDaysWorked

              totalHoursOvertime
              totalHoursOvernight
            
              totalHoursBreakScheduled
              totalHoursBreakTaken
            
              totalDaysScheduled
              totalHoursScheduled
          
              absenceInfo {
                totalHoursShiftRequest
                totalHoursWorkedAbroad
                totalHoursPaidAbsence
                totalHoursUnpaidAbsence
                totalHoursSick
              }

            }
            groupTotalMinsLate
            groupTotalAbsenceMins
            groupTotalMinsWorked
            groupTotalMinsScheduled
          }
          totalCount  
    }
  }`

const absenceTypes = gql`
  query absenceTypes {
    absenceTypes {
      _id
      name
      explRequired
      attachRequired
      shiftRequest

      requestType
      requestTimeType
      requestHoursPerDay
    }
  }
`

const payDates = `
  query payDates{
    payDates{
      _id
      payDates
    } 
  }
`

const holidays = `
query holidays {
  holidays {
    _id
    holidayName
    startTime
    endTime
  }
}`

const scheduleConfigs = gql`
  query scheduleConfigs {
    scheduleConfigs {
      _id
      scheduleName
      lunchBreakInMins
      shiftStart
      shiftEnd
      configDays {
        _id
        configName
        configShiftStart
        configShiftEnd
        overnightShift
      }
    }
  }
`

const deviceConfigs = `
query deviceConfigs (${listParamsDef}){
  deviceConfigs(${listParamsValue}) {
    list {
      _id 
      deviceName
      serialNo
      extractRequired
    }
    totalCount
  }
}`

const timeLogsPerUser = gql`
  query timeLogsPerUser($userId: String, $startDate: String, $endDate: String) {
    timeLogsPerUser(userId: $userId, startDate: $startDate, endDate: $endDate) {
      _id
      timelog
      deviceName
      deviceSerialNo
    }
  }
`

const timeclockBranches = `
query timeclockBranches($searchValue: String){
  timeclockBranches(searchValue: $searchValue){
    _id
    title
    userIds
  }
}`

const timeclockDepartments = `
query timeclockDepartments($searchValue: String){
  timeclockDepartments(searchValue: $searchValue){
    _id
    title
    userIds
  }
}`

const scheduleConfigOrder = gql`
  query scheduleConfigOrder($userId: String) {
    scheduleConfigOrder(userId: $userId) {
      _id
      userId
      orderedList {
        order
        pinned
        scheduleConfigId
        label
      }
    }
  }
`

export default {
  timeclockReports,
  branches,

  timeclocksMain,
  timeclocksPerUser,

  timelogsMain,
  timeLogsPerUser,

  schedulesMain,
  requestsMain,
  checkDuplicateScheduleShifts,

  absenceTypes,
  payDates,
  holidays,

  scheduleConfigs,
  deviceConfigs,
  scheduleConfigOrder,

  timeclockBranches,
  timeclockDepartments,
}
