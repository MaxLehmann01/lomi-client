import TabPanel from '@renderer/src/modules/Shared/components/TabPanel';

export default function RequestCookiesTab({
    tabIndex,
    selectedTabIndex,
}: {
    tabIndex: number;
    selectedTabIndex: number;
}) {
    return (
        <TabPanel
            use={'request-configurator'}
            tabIndex={tabIndex}
            selectedTabIndex={selectedTabIndex}
        >
            Cookies
        </TabPanel>
    );
}
