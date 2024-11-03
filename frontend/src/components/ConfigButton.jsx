// ConfigButton.js
import React, { useState } from 'react';
import { Button, IconButton, useDisclosure } from '@chakra-ui/react';
import ConfigModal from './ConfigModal';

const ConfigButton = ({ type, buttonText, buttonIcon, modalTitle, modalContent, width, height, noFooter }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {
                type == 'icon-button' ?
                    <IconButton
                        icon={buttonIcon}
                        aria-label={buttonText}
                        onClick={onOpen}
                        variant="outline"
                        colorScheme="teal"
                    />
                    :
                    <Button
                        aria-label={buttonText}
                        onClick={onOpen}
                        colorScheme="teal"
                    >
                       {buttonIcon} { buttonIcon ? <p>&nbsp;</p>: null} {buttonText}
                    </Button>
            }
            <ConfigModal
                isOpen={isOpen}
                noFooter={noFooter}
                onClose={onClose}
                title={modalTitle}
                content={modalContent}
                width={width}
                height={height}
            />
        </>
    );
};

export default ConfigButton;
