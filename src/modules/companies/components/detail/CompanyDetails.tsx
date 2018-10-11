import { ActivityList } from 'modules/activityLogs/components';
import { IUser } from 'modules/auth/types';
import {
  DataWithLoader,
  Icon,
  Tabs,
  TabTitle
} from 'modules/common/components';
import { ActivityContent } from 'modules/common/styles/main';
import { __ } from 'modules/common/utils';
import { ICompany, ICompanyActivityLog } from 'modules/companies/types';
import { hasAnyActivity } from 'modules/customers/utils';
import { Form as NoteForm } from 'modules/internalNotes/containers';
import { Wrapper } from 'modules/layout/components';
import { WhiteBox } from 'modules/layout/styles';
import { MailForm } from 'modules/settings/integrations/containers/google';
import * as React from 'react';
import { withRouter } from 'react-router';
import { IRouterProps } from '../../../common/types';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

interface IProps extends IRouterProps {
  company: ICompany;
  currentUser: IUser;
  companyActivityLog: ICompanyActivityLog[];
  taggerRefetchQueries?: any[];
  loadingLogs: boolean;
}

type State = {
  currentTab: string;
  currentNoteTab: string;
  attachmentPreview: any;
};

class CompanyDetails extends React.Component<IProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 'activity',
      currentNoteTab: 'newNote',
      attachmentPreview: null
    };

    this.onTabClick = this.onTabClick.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.setAttachmentPreview = this.setAttachmentPreview.bind(this);
  }

  onTabClick(currentTab) {
    this.setState({ currentTab });
  }

  onChangeTab(currentNoteTab) {
    this.setState({ currentNoteTab });
  }

  setAttachmentPreview(attachmentPreview) {
    this.setState({ attachmentPreview });
  }

  renderTabContent() {
    const { currentTab } = this.state;

    const {
      currentUser,
      companyActivityLog,
      company,
      loadingLogs
    } = this.props;

    const hasActivity = hasAnyActivity(companyActivityLog);

    return (
      <ActivityContent isEmpty={!hasActivity}>
        <DataWithLoader
          loading={loadingLogs}
          count={!loadingLogs && hasActivity ? 1 : 0}
          data={
            <ActivityList
              user={currentUser}
              activities={companyActivityLog}
              target={company.primaryName || ''}
              type={currentTab}
            />
          }
          emptyText="No Activities"
          emptyImage="/images/robots/robot-03.svg"
        />
      </ActivityContent>
    );
  }

  renderHeaderTabContent() {
    const { company } = this.props;
    const { currentNoteTab } = this.state;

    if (currentNoteTab === 'newNote') {
      return <NoteForm contentType="company" contentTypeId={company._id} />;
    }

    return (
      <MailForm
        contentType="company"
        contentTypeId={company._id}
        toEmails={company.emails}
        setAttachmentPreview={this.setAttachmentPreview}
        attachmentPreview={this.state.attachmentPreview}
      />
    );
  }

  render() {
    const { currentTab, currentNoteTab } = this.state;
    const { company, taggerRefetchQueries } = this.props;

    const breadcrumb = [
      { title: __('Companies'), link: '/companies' },
      { title: company.primaryName || 'N/A' }
    ];

    const content = (
      <div>
        <WhiteBox>
          <Tabs>
            <TabTitle
              className={currentNoteTab === 'newNote' ? 'active' : ''}
              onClick={() => this.onChangeTab('newNote')}
            >
              <Icon icon="edit-1" /> {__('New note')}
            </TabTitle>
            <TabTitle
              className={currentNoteTab === 'email' ? 'active' : ''}
              onClick={() => this.onChangeTab('email')}
            >
              <Icon icon="email" /> {__('Email')}
            </TabTitle>
          </Tabs>

          {this.renderHeaderTabContent()}
        </WhiteBox>

        <Tabs grayBorder>
          <TabTitle
            className={currentTab === 'activity' ? 'active' : ''}
            onClick={() => this.onTabClick('activity')}
          >
            {__('Activity')}
          </TabTitle>
          <TabTitle
            className={currentTab === 'notes' ? 'active' : ''}
            onClick={() => this.onTabClick('notes')}
          >
            {__('Notes')}
          </TabTitle>
          <TabTitle
            className={currentTab === 'conversations' ? 'active' : ''}
            onClick={() => this.onTabClick('conversations')}
          >
            {__('Conversation')}
          </TabTitle>
        </Tabs>

        {this.renderTabContent()}
      </div>
    );

    return (
      <Wrapper
        header={<Wrapper.Header breadcrumb={breadcrumb} />}
        leftSidebar={
          <LeftSidebar
            {...this.props}
            taggerRefetchQueries={taggerRefetchQueries}
          />
        }
        rightSidebar={<RightSidebar company={company} />}
        content={content}
        transparent={true}
      />
    );
  }
}

export default withRouter<IRouterProps>(CompanyDetails);
