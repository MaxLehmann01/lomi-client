import { Card, Divider, IconButton, Tooltip } from '@mui/material';
import AuthButton from '@renderer/src/modules/Auth/components/AuthButton';
import { Add as AddIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import RequestDrawer from '@renderer/src/modules/Request/components/Drawer';
import RequestConfigurator from '@renderer/src/modules/Request/Configurator';
import ResponseContainer from '@renderer/src/modules/Response/Container';

export default function Layout() {
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

    const [responseHeight, setResponseHeight] = useState<number>(260);
    const dragStateRef = useRef<{ startY: number; startHeight: number } | null>(
        null
    );

    useEffect(() => {
        function onPointerMove(e: PointerEvent) {
            if (!dragStateRef.current) return;

            const { startY, startHeight } = dragStateRef.current;
            const dy = e.clientY - startY;

            const next = startHeight - dy;

            const min = 120;
            const max = Math.max(min, window.innerHeight - 200);
            setResponseHeight(Math.min(max, Math.max(min, next)));
        }

        function onPointerUp() {
            dragStateRef.current = null;
        }

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);

        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };
    }, []);

    return (
        <div className="h-full w-full flex flex-col overflow-hidden min-h-0">
            <div className="flex-1 min-h-0 flex overflow-hidden relative">
                <RequestDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                />

                <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
                    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                        <div className="flex-1 min-h-0 overflow-hidden">
                            <div className="h-full min-h-0 overflow-hidden flex flex-col">
                                <RequestConfigurator />
                            </div>
                        </div>
                        <Divider />
                        <div
                            className="shrink-0 overflow-hidden"
                            style={{ height: responseHeight }}
                        >
                            <div
                                className="h-2 cursor-row-resize select-none flex items-center justify-center"
                                onPointerDown={(e) => {
                                    dragStateRef.current = {
                                        startY: e.clientY,
                                        startHeight: responseHeight,
                                    };
                                    e.currentTarget.setPointerCapture(
                                        e.pointerId
                                    );
                                }}
                            >
                                <div className="h-0.5 w-16 bg-white/20 rounded" />
                            </div>

                            <div className="h-[calc(100%-0.5rem)] min-h-0 overflow-auto">
                                <ResponseContainer />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Divider />

            <Card className="w-full flex items-center justify-between p-2 shrink-0">
                <div className="flex gap-2 items-center">
                    <Tooltip title={isDrawerOpen ? 'Close Menu' : 'Open Menu'}>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => setIsDrawerOpen((prev) => !prev)}
                        >
                            <MenuIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="New Request">
                        <IconButton size="small" color="primary">
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </div>

                <div className="flex gap-2 items-center">
                    <AuthButton />
                </div>
            </Card>
        </div>
    );
}
