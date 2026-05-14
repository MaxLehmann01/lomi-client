import { ReactNode } from 'react';

export type TabPanelProps = {
    tabIndex: number;
    selectedTabIndex: number;
};

export default function TabPanel({
    use,
    children,
    tabIndex,
    selectedTabIndex,
}: TabPanelProps & { use: string; children: ReactNode }) {
    const isSelected = selectedTabIndex === tabIndex;

    return (
        <div
            hidden={!isSelected}
            id={`${use}-${tabIndex}`}
            aria-labelledby={`tab-${tabIndex}`}
            className={'h-full min-h-0'}
        >
            {isSelected && <div className={'h-full min-h-0'}>{children}</div>}
        </div>
    );
}
