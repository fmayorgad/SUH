import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/common/not-found/not-found.component';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { CrmComponent } from './pages/dashboard/crm/crm.component';
import { ProjectManagementComponent } from './pages/dashboard/project-management/project-management.component';
import { LmsComponent } from './pages/dashboard/lms/lms.component';
import { HelpDeskComponent } from './pages/dashboard/help-desk/help-desk.component';
import { EcommercePageComponent } from './pages/pages/ecommerce-page/ecommerce-page.component';
import { EProductsGridComponent } from './pages/pages/ecommerce-page/e-products-grid/e-products-grid.component';
import { EProductsListComponent } from './pages/pages/ecommerce-page/e-products-list/e-products-list.component';
import { EProductDetailsComponent } from './pages/pages/ecommerce-page/e-product-details/e-product-details.component';
import { EOrdersListComponent } from './pages/pages/ecommerce-page/e-orders-list/e-orders-list.component';
import { ECustomersListComponent } from './pages/pages/ecommerce-page/e-customers-list/e-customers-list.component';
import { ESellersComponent } from './pages/pages/ecommerce-page/e-sellers/e-sellers.component';
import { ESellerDetailsComponent } from './pages/pages/ecommerce-page/e-seller-details/e-seller-details.component';
import { EOrderDetailsComponent } from './pages/pages/ecommerce-page/e-order-details/e-order-details.component';
import { ECartComponent } from './pages/pages/ecommerce-page/e-cart/e-cart.component';
import { ECheckoutComponent } from './pages/pages/ecommerce-page/e-checkout/e-checkout.component';
import { ECreateProductComponent } from './pages/pages/ecommerce-page/e-create-product/e-create-product.component';
import { CrmPageComponent } from './pages/pages/crm-page/crm-page.component';
import { CContactsComponent } from './pages/pages/crm-page/c-contacts/c-contacts.component';
import { CCustomersComponent } from './pages/pages/crm-page/c-customers/c-customers.component';
import { CLeadsComponent } from './pages/pages/crm-page/c-leads/c-leads.component';
import { COpportunitiesComponent } from './pages/pages/crm-page/c-opportunities/c-opportunities.component';
import { ProjectManagementPageComponent } from './pages/pages/project-management-page/project-management-page.component';
import { PmProjectsListComponent } from './pages/pages/project-management-page/pm-projects-list/pm-projects-list.component';
import { PmProjectDetailsComponent } from './pages/pages/project-management-page/pm-project-details/pm-project-details.component';
import { PmCreateProjectComponent } from './pages/pages/project-management-page/pm-create-project/pm-create-project.component';
import { PmClientsComponent } from './pages/pages/project-management-page/pm-clients/pm-clients.component';
import { PmTeamsComponent } from './pages/pages/project-management-page/pm-teams/pm-teams.component';
import { PmTasksComponent } from './pages/pages/project-management-page/pm-tasks/pm-tasks.component';
import { PmUsersComponent } from './pages/pages/project-management-page/pm-users/pm-users.component';
import { PmKanbanBoardComponent } from './pages/pages/project-management-page/pm-kanban-board/pm-kanban-board.component';
import { LmsPageComponent } from './pages/pages/lms-page/lms-page.component';
import { LCoursesListComponent } from './pages/pages/lms-page/l-courses-list/l-courses-list.component';
import { LCourseDetailsComponent } from './pages/pages/lms-page/l-course-details/l-course-details.component';
import { LCreateCourseComponent } from './pages/pages/lms-page/l-create-course/l-create-course.component';
import { LLessonPreviewComponent } from './pages/pages/lms-page/l-lesson-preview/l-lesson-preview.component';
import { HelpDeskPageComponent } from './pages/pages/help-desk-page/help-desk-page.component';
import { HdTicketsComponent } from './pages/pages/help-desk-page/hd-tickets/hd-tickets.component';
import { HdReportsComponent } from './pages/pages/help-desk-page/hd-reports/hd-reports.component';
import { HdAgentsComponent } from './pages/pages/help-desk-page/hd-agents/hd-agents.component';
import { EventsListComponent } from './pages/pages/events-page/events-list/events-list.component';
import { EventDetailsComponent } from './pages/pages/events-page/event-details/event-details.component';
import { CreateAnEventComponent } from './pages/pages/events-page/create-an-event/create-an-event.component';
import { EventsPageComponent } from './pages/pages/events-page/events-page.component';
import { InvoicesPageComponent } from './pages/pages/invoices-page/invoices-page.component';
import { InvoicesComponent } from './pages/pages/invoices-page/invoices/invoices.component';
import { InvoiceDetailsComponent } from './pages/pages/invoices-page/invoice-details/invoice-details.component';
import { AppsComponent } from './pages/apps/apps.component';
import { KanbanBoardComponent } from './pages/apps/kanban-board/kanban-board.component';
import { ToDoListComponent } from './pages/apps/to-do-list/to-do-list.component';
import { ContactsComponent } from './pages/apps/contacts/contacts.component';
import { PricingPageComponent } from './pages/pages/pricing-page/pricing-page.component';
import { StarterComponent } from './pages/starter/starter.component';
import { FaqPageComponent } from './pages/pages/faq-page/faq-page.component';
import { NotificationsPageComponent } from './pages/pages/notifications-page/notifications-page.component';
import { UsersPageComponent } from './pages/pages/users-page/users-page.component';
import { TeamMembersComponent } from './pages/pages/users-page/team-members/team-members.component';
import { UsersListComponent } from './pages/pages/users-page/users-list/users-list.component';
import { AddUserComponent } from './pages/pages/users-page/add-user/add-user.component';
import { ProfilePageComponent } from './pages/pages/profile-page/profile-page.component';
import { PUserProfileComponent } from './pages/pages/profile-page/p-user-profile/p-user-profile.component';
import { PProjectsComponent } from './pages/pages/profile-page/p-projects/p-projects.component';
import { PTeamsComponent } from './pages/pages/profile-page/p-teams/p-teams.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AccountSettingsComponent } from './pages/settings/account-settings/account-settings.component';
import { ChangePasswordComponent } from './pages/settings/change-password/change-password.component';
import { ConnectionsComponent } from './pages/settings/connections/connections.component';
import { PrivacyPolicyComponent } from './pages/settings/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './pages/settings/terms-conditions/terms-conditions.component';
import { MapsPageComponent } from './pages/pages/maps-page/maps-page.component';
import { IconsComponent } from './pages/icons/icons.component';
import { FeathericonsComponent } from './pages/icons/feathericons/feathericons.component';
import { RemixiconComponent } from './pages/icons/remixicon/remixicon.component';
import { MaterialSymbolsComponent } from './pages/icons/material-symbols/material-symbols.component';
import { ChartsComponent } from './pages/charts/charts.component';
import { ApexchartsComponent } from './pages/charts/apexcharts/apexcharts.component';
import { GaugeComponent } from './pages/charts/gauge/gauge.component';
import { InternalErrorComponent } from './pages/common/internal-error/internal-error.component';
import { TimelinePageComponent } from './pages/pages/timeline-page/timeline-page.component';
import { BlankPageComponent } from './pages/blank-page/blank-page.component';
import { GalleryPageComponent } from './pages/pages/gallery-page/gallery-page.component';
import { SearchPageComponent } from './pages/pages/search-page/search-page.component';
import { TestimonialsPageComponent } from './pages/pages/testimonials-page/testimonials-page.component';
import { WidgetsComponent } from './pages/widgets/widgets.component';
import { FileManagerComponent } from './pages/apps/file-manager/file-manager.component';
import { CalendarComponent } from './pages/apps/calendar/calendar.component';
import { ChatComponent } from './pages/apps/chat/chat.component';
import { EmailComponent } from './pages/apps/email/email.component';
import { InboxComponent } from './pages/apps/email/inbox/inbox.component';
import { ComposeComponent } from './pages/apps/email/compose/compose.component';
import { ReadComponent } from './pages/apps/email/read/read.component';
import { SocialFeedPageComponent } from './pages/pages/social-feed-page/social-feed-page.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { SignInComponent } from './pages/authentication/sign-in/sign-in.component';
import { SignUpComponent } from './pages/authentication/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './pages/authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/authentication/reset-password/reset-password.component';
import { LockScreenComponent } from './pages/authentication/lock-screen/lock-screen.component';
import { ConfirmEmailComponent } from './pages/authentication/confirm-email/confirm-email.component';
import { LogoutComponent } from './pages/authentication/logout/logout.component';
import { TablesComponent } from './pages/tables/tables.component';
import { FormsComponent } from './pages/forms/forms.component';
import { BasicElementsComponent } from './pages/forms/basic-elements/basic-elements.component';
import { AdvancedElementsComponent } from './pages/forms/advanced-elements/advanced-elements.component';
import { WizardComponent } from './pages/forms/wizard/wizard.component';
import { EditorsComponent } from './pages/forms/editors/editors.component';
import { FileUploaderComponent } from './pages/forms/file-uploader/file-uploader.component';
import { UiElementsComponent } from './pages/ui-elements/ui-elements.component';
import { AlertsComponent } from './pages/ui-elements/alerts/alerts.component';
import { AutocompleteComponent } from './pages/ui-elements/autocomplete/autocomplete.component';
import { AvatarsComponent } from './pages/ui-elements/avatars/avatars.component';
import { AccordionComponent } from './pages/ui-elements/accordion/accordion.component';
import { BadgesComponent } from './pages/ui-elements/badges/badges.component';
import { BreadcrumbComponent } from './pages/ui-elements/breadcrumb/breadcrumb.component';
import { ButtonToggleComponent } from './pages/ui-elements/button-toggle/button-toggle.component';
import { BottomSheetComponent } from './pages/ui-elements/bottom-sheet/bottom-sheet.component';
import { ButtonsComponent } from './pages/ui-elements/buttons/buttons.component';
import { CardsComponent } from './pages/ui-elements/cards/cards.component';
import { CarouselsComponent } from './pages/ui-elements/carousels/carousels.component';
import { CheckboxComponent } from './pages/ui-elements/checkbox/checkbox.component';
import { ChipsComponent } from './pages/ui-elements/chips/chips.component';
import { ColorPickerComponent } from './pages/ui-elements/color-picker/color-picker.component';
import { ClipboardComponent } from './pages/ui-elements/clipboard/clipboard.component';
import { ExpansionComponent } from './pages/ui-elements/expansion/expansion.component';
import { DragDropComponent } from './pages/ui-elements/drag-drop/drag-drop.component';
import { DividerComponent } from './pages/ui-elements/divider/divider.component';
import { DialogComponent } from './pages/ui-elements/dialog/dialog.component';
import { DatepickerComponent } from './pages/ui-elements/datepicker/datepicker.component';
import { IconComponent } from './pages/ui-elements/icon/icon.component';
import { GridListComponent } from './pages/ui-elements/grid-list/grid-list.component';
import { FormFieldComponent } from './pages/ui-elements/form-field/form-field.component';
import { UtilitiesComponent } from './pages/ui-elements/utilities/utilities.component';
import { VideosComponent } from './pages/ui-elements/videos/videos.component';
import { TreeComponent } from './pages/ui-elements/tree/tree.component';
import { TabsComponent } from './pages/ui-elements/tabs/tabs.component';
import { TableComponent } from './pages/ui-elements/table/table.component';
import { ToolbarComponent } from './pages/ui-elements/toolbar/toolbar.component';
import { TypographyComponent } from './pages/ui-elements/typography/typography.component';
import { StepperComponent } from './pages/ui-elements/stepper/stepper.component';
import { SnackbarComponent } from './pages/ui-elements/snackbar/snackbar.component';
import { SliderComponent } from './pages/ui-elements/slider/slider.component';
import { SlideToggleComponent } from './pages/ui-elements/slide-toggle/slide-toggle.component';
import { SidenavComponent } from './pages/ui-elements/sidenav/sidenav.component';
import { SelectComponent } from './pages/ui-elements/select/select.component';
import { RatioComponent } from './pages/ui-elements/ratio/ratio.component';
import { RadioComponent } from './pages/ui-elements/radio/radio.component';
import { ProgressBarComponent } from './pages/ui-elements/progress-bar/progress-bar.component';
import { PaginationComponent } from './pages/ui-elements/pagination/pagination.component';
import { MenusComponent } from './pages/ui-elements/menus/menus.component';
import { ListboxComponent } from './pages/ui-elements/listbox/listbox.component';
import { ListComponent } from './pages/ui-elements/list/list.component';
import { InputComponent } from './pages/ui-elements/input/input.component';
import { TooltipComponent } from './pages/ui-elements/tooltip/tooltip.component';

import { WeeksComponent } from './pages/weeks/weeks.component';
import { CreateditWeeksComponent } from './pages/weeks/create/createdit.component';
import {ViewWeekComponent} from './pages/weeks/view/view.week.component';
import { WeekGroupsComponent } from './pages/weekgroups/weekgroups.component';
import { WeekGroupDetailComponent } from './pages/weekgroups/group/weekgroupdetail.component';
import { AuthGuardService } from '@guards/auth.guard';
import {VisitsComponent} from '@pages/visits/visits.component';
import {VisitDetailComponent} from '@pages/visits/view/visit-detail.component';
import {VisitdocumentComponent} from '@pages/visit-documents/visitdocument.component';
import {NormativityComponent} from '@pages/normativity/normativity.component';
import {InprocessComponent} from '@pages/visits/inproccess/inprocess.component';
import { UsersManagementComponent } from './pages/users-management/users-management.component';

export const routes: Routes = [
  {
    path: 'semanas',
    canActivate: [AuthGuardService],
    data: { avaliableBy: 'permission', strategy: 'semanas', permission: 'LIST' },
    children: [
      { path: '', component: WeeksComponent },
      {
        path: 'crear',
        component: CreateditWeeksComponent,
        canActivate: [AuthGuardService],
        data: { avaliableBy: 'permission', strategy: 'semanas/crear', permission: 'CREATE' },
      },
      {
        path: 'editar/:id',
        component: CreateditWeeksComponent,
        canActivate: [AuthGuardService],
        data: { avaliableBy: 'permission', strategy: 'default', permission: 'EDIT' },
      },
      {
        path: 'view/:id',
        component: ViewWeekComponent,
        canActivate: [AuthGuardService],
        data: { avaliableBy: 'permission', strategy: 'default', permission: 'VIEW' },
      }
    ],
  },
  {
    path: 'grupos-semana',
    canActivate: [AuthGuardService],
    data: { avaliableBy: 'module', strategy: 'default' },
    children: [
      {
        path: '',
        component: WeekGroupsComponent,
        canActivate: [AuthGuardService],
        data: { avaliableBy: 'module', strategy: 'default' },
      },
      {
        path: ':id',
        component: WeekGroupDetailComponent,
        canActivate: [AuthGuardService],
        data: { avaliableBy: 'permission', strategy: 'default', permission: 'DETAIL' },
      },
    ],
  },

  {
    path: 'visitas',
    canActivate: [AuthGuardService],
    data: { avaliableBy: 'module', strategy: 'default' },
    children: [
      {
        path: '',
        component: VisitsComponent,
        canActivate: [AuthGuardService],
        data: { avaliableBy: 'module', strategy: 'default' },
      },
      {
        path: 'visita/:id',
        component: VisitDetailComponent,
        canActivate: [AuthGuardService],
        data: { avaliableBy: 'permission', strategy: 'default', permission: 'DETAIL' },
      },
      {
        path: ':id',
        component: InprocessComponent,
        canActivate: [AuthGuardService],
        data: { avaliableBy: 'permission', strategy: 'default', permission: 'DETAIL' },
      },
    ],
  },
  {
    path: 'documentosrevision',
    /* canActivate: [AuthGuardService], */
    data: { avaliableBy: 'module', strategy: 'default' },
    children: [
      {
        path: '',
        component: VisitdocumentComponent,
       /*  canActivate: [AuthGuardService], */
        data: { avaliableBy: 'module', strategy: 'default' },
      },
      {
        path: ':id',
        component: WeekGroupDetailComponent,
        /* canActivate: [AuthGuardService], */
        data: { avaliableBy: 'permission', strategy: 'default', permission: 'DETAIL' },
      },
    ],
  },
  {
    path: 'normatividad',
    /* canActivate: [AuthGuardService], */
    data: { avaliableBy: 'module', strategy: 'default' },
    children: [
      {
        path: '',
        component: NormativityComponent,
       /*  canActivate: [AuthGuardService], */
        data: { avaliableBy: 'module', strategy: 'default' },
      },
      {
        path: ':id',
        component: WeekGroupDetailComponent,
        /* canActivate: [AuthGuardService], */
        data: { avaliableBy: 'permission', strategy: 'default', permission: 'DETAIL' },
      },
    ],
  },
  { path: 'crm', component: CrmComponent },
  { path: 'project-management', component: ProjectManagementComponent },
  { path: 'lms', component: LmsComponent },
  { path: 'help-desk', component: HelpDeskComponent },
  {
    path: 'apps',
    component: HelpDeskComponent,
    children: [
      { path: '', component: ToDoListComponent },
      { path: 'kanban-board', component: KanbanBoardComponent },
      { path: 'file-manager', component: FileManagerComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'chat', component: ChatComponent },
      {
        path: 'email',
        component: EmailComponent,
        children: [
          { path: '', component: InboxComponent },
          { path: 'compose', component: ComposeComponent },
          { path: 'read', component: ReadComponent },
        ],
      },
    ],
  },
  {
    path: 'ecommerce-page',
    component: EcommercePageComponent,
    children: [
      { path: '', component: EProductsGridComponent },
      { path: 'products-list', component: EProductsListComponent },
      { path: 'product-details', component: EProductDetailsComponent },
      { path: 'create-product', component: ECreateProductComponent },
      { path: 'cart', component: ECartComponent },
      { path: 'checkout', component: ECheckoutComponent },
      { path: 'orders-list', component: EOrdersListComponent },
      { path: 'order-details', component: EOrderDetailsComponent },
      { path: 'customers-list', component: ECustomersListComponent },
      { path: 'sellers', component: ESellersComponent },
      { path: 'seller-details', component: ESellerDetailsComponent },
    ],
  },
  {
    path: 'crm-page',
    component: CrmPageComponent,
    children: [
      { path: '', component: CContactsComponent },
      { path: 'customers', component: CCustomersComponent },
      { path: 'leads', component: CLeadsComponent },
      { path: 'opportunities', component: COpportunitiesComponent },
    ],
  },
  {
    path: 'project-management-page',
    component: ProjectManagementPageComponent,
    children: [
      { path: '', component: PmProjectsListComponent },
      { path: 'project-details', component: PmProjectDetailsComponent },
      { path: 'create-project', component: PmCreateProjectComponent },
      { path: 'clients', component: PmClientsComponent },
      { path: 'teams', component: PmTeamsComponent },
      { path: 'tasks', component: PmTasksComponent },
      { path: 'users', component: PmUsersComponent },
      { path: 'kanban-board', component: PmKanbanBoardComponent },
    ],
  },
  {
    path: 'lms-page',
    component: LmsPageComponent,
    children: [
      { path: '', component: LCoursesListComponent },
      { path: 'course-details', component: LCourseDetailsComponent },
      { path: 'lesson-preview', component: LLessonPreviewComponent },
      { path: 'create-course', component: LCreateCourseComponent },
    ],
  },
  {
    path: 'help-desk-page',
    component: HelpDeskPageComponent,
    children: [
      { path: '', component: HdTicketsComponent },
      { path: 'reports', component: HdReportsComponent },
      { path: 'agents', component: HdAgentsComponent },
    ],
  },
  {
    path: 'events',
    component: EventsPageComponent,
    children: [
      { path: '', component: EventsListComponent },
      { path: 'event-details', component: EventDetailsComponent },
      { path: 'create-an-event', component: CreateAnEventComponent },
    ],
  },
  { path: 'social-feed', component: SocialFeedPageComponent },
  {
    path: 'invoices',
    component: InvoicesPageComponent,
    children: [
      { path: '', component: InvoicesComponent },
      { path: 'invoice-details', component: InvoiceDetailsComponent },
    ],
  },
  { path: 'pricing', component: PricingPageComponent },
  { path: 'faq', component: FaqPageComponent },
  { path: 'maps', component: MapsPageComponent },
  { path: 'notifications', component: NotificationsPageComponent },
  {
    path: 'icons',
    component: IconsComponent,
    children: [
      { path: '', component: MaterialSymbolsComponent },
      { path: 'feathericons', component: FeathericonsComponent },
      { path: 'remixicon', component: RemixiconComponent },
    ],
  },
  {
    path: 'ui-kit',
    component: UiElementsComponent,
    children: [
      { path: '', component: AlertsComponent },
      { path: 'autocomplete', component: AutocompleteComponent },
      { path: 'avatars', component: AvatarsComponent },
      { path: 'accordion', component: AccordionComponent },
      { path: 'badges', component: BadgesComponent },
      { path: 'breadcrumb', component: BreadcrumbComponent },
      { path: 'button-toggle', component: ButtonToggleComponent },
      { path: 'bottom-sheet', component: BottomSheetComponent },
      { path: 'buttons', component: ButtonsComponent },
      { path: 'cards', component: CardsComponent },
      { path: 'carousels', component: CarouselsComponent },
      { path: 'checkbox', component: CheckboxComponent },
      { path: 'chips', component: ChipsComponent },
      { path: 'color-picker', component: ColorPickerComponent },
      { path: 'clipboard', component: ClipboardComponent },
      { path: 'datepicker', component: DatepickerComponent },
      { path: 'dialog', component: DialogComponent },
      { path: 'divider', component: DividerComponent },
      { path: 'drag-drop', component: DragDropComponent },
      { path: 'expansion', component: ExpansionComponent },
      { path: 'form-field', component: FormFieldComponent },
      { path: 'grid-list', component: GridListComponent },
      { path: 'icon', component: IconComponent },
      { path: 'input', component: InputComponent },
      { path: 'list', component: ListComponent },
      { path: 'listbox', component: ListboxComponent },
      { path: 'menus', component: MenusComponent },
      { path: 'pagination', component: PaginationComponent },
      { path: 'progress-bar', component: ProgressBarComponent },
      { path: 'radio', component: RadioComponent },
      { path: 'ratio', component: RatioComponent },
      { path: 'select', component: SelectComponent },
      { path: 'sidenav', component: SidenavComponent },
      { path: 'slide-toggle', component: SlideToggleComponent },
      { path: 'slider', component: SliderComponent },
      { path: 'snackbar', component: SnackbarComponent },
      { path: 'stepper', component: StepperComponent },
      { path: 'typography', component: TypographyComponent },
      { path: 'tooltip', component: TooltipComponent },
      { path: 'toolbar', component: ToolbarComponent },
      { path: 'table', component: TableComponent },
      { path: 'tabs', component: TabsComponent },
      { path: 'tree', component: TreeComponent },
      { path: 'videos', component: VideosComponent },
      { path: 'utilities', component: UtilitiesComponent },
    ],
  },
  { path: 'timeline', component: TimelinePageComponent },
  { path: 'gallery', component: GalleryPageComponent },
  { path: 'testimonials', component: TestimonialsPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'blank-page', component: BlankPageComponent },
  { path: 'internal-error', component: InternalErrorComponent },
  { path: 'widgets', component: WidgetsComponent },
  { path: 'tables', component: TablesComponent },
  {
    path: 'forms',
    component: FormsComponent,
    children: [
      { path: '', component: BasicElementsComponent },
      { path: 'advanced-elements', component: AdvancedElementsComponent },
      { path: 'wizard', component: WizardComponent },
      { path: 'editors', component: EditorsComponent },
      { path: 'file-uploader', component: FileUploaderComponent },
    ],
  },

  {
    path: 'charts',
    component: ChartsComponent,
    children: [
      { path: '', component: ApexchartsComponent },
      { path: 'gauge', component: GaugeComponent },
    ],
  },
  { path: 'starter', component: StarterComponent },
  {
    path: 'users',
    component: UsersPageComponent,
    children: [
      { path: '', component: TeamMembersComponent },
      { path: 'users-list', component: UsersListComponent },
      { path: 'add-user', component: AddUserComponent },
    ],
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
    children: [
      { path: '', component: PUserProfileComponent },
      { path: 'teams', component: PTeamsComponent },
      { path: 'projects', component: PProjectsComponent },
    ],
  },
  //{path: 'my-profile', component: MyProfileComponent},
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: '', component: AccountSettingsComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'connections', component: ConnectionsComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'terms-conditions', component: TermsConditionsComponent },
    ],
  },
  {
    path: 'authentication',
    component: AuthenticationComponent,
    children: [
      { path: '', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'lock-screen', component: LockScreenComponent },
      { path: 'confirm-email', component: ConfirmEmailComponent },
      { path: 'logout', component: LogoutComponent },
    ],
  },
  // Here add new pages component

  {
    path: 'usuarios-gestion',
    canActivate: [AuthGuardService],
    data: { avaliableBy: 'permission', strategy: 'usuarios', permission: 'LIST' },
    component: UsersManagementComponent
  },

  { path: '**', component: NotFoundComponent }, // This line will remain down from the whole pages component list
];
