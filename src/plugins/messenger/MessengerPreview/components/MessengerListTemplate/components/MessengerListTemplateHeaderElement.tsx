import { IFBMListTemplateElement } from '../../../interfaces/ListTemplatePayload.interface';
import { IWithFBMActionEventHandler } from '../../../MessengerPreview.interface';
import { MessagePluginFactoryProps } from '../../../../../../common/interfaces/message-plugin';
import { getMessengerSubtitle } from '../../MessengerSubtitle';
import { getMessengerTitle } from '../../MessengerTitle';
import { getFlexImage } from '../../FlexImage';
import { getMessengerListButton } from '../../MessengerListButton';
import { getButtonLabel } from '../../MessengerButton/lib/messengerButtonHelpers';
import { getBackgroundImage } from '../../../lib/css';
import { IWebchatConfig } from '../../../../../../common/interfaces/webchat-config';
import { useRandomId } from '../../../../../../common/utils/randomId';

interface IMessengerListTemplateHeaderElementProps extends IWithFBMActionEventHandler {
    element: IFBMListTemplateElement;
    config: IWebchatConfig;
}

export const getMessengerListTemplateHeaderElement = ({ React, styled }: MessagePluginFactoryProps) => {
    const MessengerSubtitle = getMessengerSubtitle({ React, styled });
    const MessengerTitle = getMessengerTitle({ React, styled });
    const FlexImage = getFlexImage({ React, styled });
    const ListButton = getMessengerListButton({ React, styled });

    const Root = styled.div(() => ({
        position: 'relative',
        "&:focus":{
            opacity: 0.85,
        }
    }));

    const DarkLayer = styled.div({
        display: 'block',
        content: '" "',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'hsla(0, 0%, 0%, .6)'
    });

    const Content = styled.div({
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        padding: 10,
    });

    const Title = styled(MessengerTitle)({
        color: 'hsla(0, 0%, 100%, .9)'
    });

    const Subtitle = styled(MessengerSubtitle)({
        color: 'hsla(0, 0%, 100%, .9)'
    });

    const FixedImage = styled.div(() => ({
        paddingTop: '50%',
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
    }));

    const ListHeaderButton = styled(ListButton)(({ theme }) => ({
        backgroundColor: theme.primaryColor,
        color: theme.primaryContrastColor,
        border: `none`,
        cursor: 'pointer',
        outline: 'none',

        '&:hover': {
            backgroundColor: theme.primaryWeakColor
		},
		
		'&:focus': {
			backgroundColor: theme.primaryStrongColor,
        },

        '&:active': {
            backgroundColor: theme.primaryStrongColor
        }
    }))

    const MessengerListTemplateHeaderElement = ({ element, onAction, config }: IMessengerListTemplateHeaderElementProps) => {
        const { title, subtitle, image_url, image_alt_text, default_action, buttons } = element;
        // TODO buttons, default_action

        const button = buttons && buttons[0];
        const messengerTitle = title ? title + ". " : "";
        const ariaLabelForMessengerTitle = default_action?.url ? messengerTitle + "Opens in new tab" : title;
        const messengerSubtitleId = useRandomId("webchatListTemplateHeaderSubtitle"); 

        const handleKeyDown = (event, default_action) => {
            if(default_action && event.key === "Enter") {
                onAction(event, default_action);
            }
        }

        const image = config.settings.dynamicImageAspectRatio
            ? <FlexImage src={image_url} alt={image_alt_text || ""} />
            : <FixedImage style={{ backgroundImage: image_url ? getBackgroundImage(image_url) : undefined }}>
					<span role="img" aria-label={image_alt_text || "List Image"}> </span>
			  </FixedImage>
        return (
            <div role="listitem">
                <Root
                    onClick={default_action && (e => onAction(e, default_action))}
                    className="webchat-list-template-header"
                    role={default_action?.url ? "link" : undefined}
                    aria-label={ariaLabelForMessengerTitle}
                    aria-describedby={subtitle ? messengerSubtitleId : undefined}
                    tabIndex={default_action?.url ? 0 : -1}
                    onKeyDown = {e => handleKeyDown(e, default_action)}
                    style={default_action?.url ? { cursor: "pointer" }:{}}
                >
                    {image}
                    <DarkLayer />
                    <Content className="webchat-list-template-header-content">
                        <Title className="webchat-list-template-header-title" dangerouslySetInnerHTML={{__html: title}} />
                        <Subtitle className="webchat-list-template-header-subtitle" dangerouslySetInnerHTML={{__html: subtitle}} config={config} id={messengerSubtitleId}/>
                        {button && (
                            <ListHeaderButton
                                onClick={e => {e.stopPropagation(); onAction(e, button)}}
                                className="webchat-list-template-header-button"
                                dangerouslySetInnerHTML={{__html: getButtonLabel(button)}}
                            >
                            </ListHeaderButton>
                        )}
                    </Content>
                </Root>
            </div>
        )
    };

    return MessengerListTemplateHeaderElement;
}