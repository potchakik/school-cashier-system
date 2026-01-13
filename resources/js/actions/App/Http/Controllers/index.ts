import DashboardController from './DashboardController'
import StudentController from './StudentController'
import PaymentController from './PaymentController'
import Settings from './Settings'
import Auth from './Auth'

const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    StudentController: Object.assign(StudentController, StudentController),
    PaymentController: Object.assign(PaymentController, PaymentController),
    Settings: Object.assign(Settings, Settings),
    Auth: Object.assign(Auth, Auth),
}

export default Controllers