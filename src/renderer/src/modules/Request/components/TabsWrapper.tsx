import { SyntheticEvent, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import RequestPathParamsTab from '@renderer/src/modules/Request/components/Tabs/PathParams';
import RequestQueryParamsTab from '@renderer/src/modules/Request/components/Tabs/QueryParams';
import RequestAuthorizationTab from '@renderer/src/modules/Request/components/Tabs/Authorization';
import RequestCookiesTab from '@renderer/src/modules/Request/components/Tabs/Cookies';
import RequestHeadersTab from '@renderer/src/modules/Request/components/Tabs/Headers';
import RequestBodyTab from '@renderer/src/modules/Request/components/Tabs/Body';

export default function RequestTabsWrapper() {
    const [selectedTab, setSelectedTab] = useState<number>(0);

    const handleTabChange = (_: SyntheticEvent, newTabIndex: number) => {
        setSelectedTab(newTabIndex);
    };

    return (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                className="w-full shrink-0"
            >
                <Tab label="Path" />
                <Tab label="Query" />
                <Tab label="Authorization" />
                <Tab label="Cookies" />
                <Tab label="Headers" />
                <Tab label="Body" />
            </Tabs>

            <div className="flex-1 min-h-0 overflow-y-auto">
                <RequestPathParamsTab
                    tabIndex={0}
                    selectedTabIndex={selectedTab}
                />
                <RequestQueryParamsTab
                    tabIndex={1}
                    selectedTabIndex={selectedTab}
                />
                <RequestAuthorizationTab
                    tabIndex={2}
                    selectedTabIndex={selectedTab}
                />
                <RequestCookiesTab
                    tabIndex={3}
                    selectedTabIndex={selectedTab}
                />
                <RequestHeadersTab
                    tabIndex={4}
                    selectedTabIndex={selectedTab}
                />
                <RequestBodyTab tabIndex={5} selectedTabIndex={selectedTab} />
            </div>
        </div>
    );
}
