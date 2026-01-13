import ProfileController from './ProfileController'
import PasswordController from './PasswordController'
import GradeLevelController from './GradeLevelController'
import SectionController from './SectionController'
import FeeStructureController from './FeeStructureController'

const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
    PasswordController: Object.assign(PasswordController, PasswordController),
    GradeLevelController: Object.assign(GradeLevelController, GradeLevelController),
    SectionController: Object.assign(SectionController, SectionController),
    FeeStructureController: Object.assign(FeeStructureController, FeeStructureController),
}

export default Settings