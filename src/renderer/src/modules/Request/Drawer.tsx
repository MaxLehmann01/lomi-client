import { Card } from '@mui/material';

export default function RequestDrawer({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div className="absolute inset-0 z-10" onClick={onClose} />

            <Card
                elevation={8}
                className="absolute left-0 top-0 z-20 h-full w-80 overflow-hidden box-border p-2"
            >
                <div className={'h-full w-full overflow-scroll'}>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    diam nonumy eirmod tempor invidunt ut labore et dolore magna
                    aliquyam erat, sed diam voluptua. At vero eos et accusam et
                    justo duo dolores et ea rebum. Stet clita kasd gubergren, no
                    sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem
                    ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                    nonumy eirmod tempor invidunt ut labore et dolore magna
                    aliquyam erat, sed diam voluptua. At vero eos et accusam et
                    justo duo dolores et ea rebum. Stet clita kasd gubergren, no
                    sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem
                    ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                    nonumy eirmod tempor invidunt ut labore et dolore magna
                    aliquyam erat, sed diam voluptua. At vero eos et accusam et
                    justo duo dolores et ea rebum. Stet clita kasd gubergren, no
                    sea takimata sanctus est Lorem ipsum dolor sit amet. Duis
                    autem vel eum iriure dolor in hendrerit in vulputate velit
                    esse molestie consequat, vel illum dolore eu feugiat nulla
                    facilisis at vero eros et accumsan et iusto odio dignissim
                    qui blandit praesent luptatum zzril delenit augue duis
                    dolore te feugait nulla facilisi. Lorem ipsum dolor sit
                    amet, consectetuer adipiscing elit, sed diam nonummy nibh
                    euismod tincidunt ut laoreet dolore magna aliquam erat
                    volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci
                    tation ullamcorper suscipit lobortis nisl ut aliquip ex ea
                    commodo consequat. Duis autem vel eum iriure dolor in
                    hendrerit in vulputate velit esse molestie consequat, vel
                    illum dolore eu feugiat nulla facilisis at vero eros et
                    accumsan et iusto odio dignissim qui blandit praesent
                    luptatum zzril delenit augue duis dolore te feugait nulla
                    facilisi. Nam liber tempor cum soluta nobis eleifend option
                    congue nihil imperdiet doming id quod mazim placerat facer
                    possim assum. Lorem
                </div>
            </Card>
        </>
    );
}
