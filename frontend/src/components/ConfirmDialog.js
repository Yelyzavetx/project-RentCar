// src/components/ConfirmDialog.js
import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const DialogTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
`;

const DialogContent = styled.div`
  margin-bottom: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled.button`
  background-color: #f5f5f5;
  color: #333;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ConfirmButton = styled.button`
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #b71c1c;
  }
`;

const ConfirmDialog = ({
                           isOpen,
                           title,
                           message,
                           onConfirm,
                           onCancel,
                           confirmText = 'Підтвердити',
                           cancelText = 'Відміна'
                       }) => {
    if (!isOpen) return null;

    return (
        <Overlay onClick={onCancel}>
            <DialogContainer onClick={(e) => e.stopPropagation()}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <p>{message}</p>
                </DialogContent>
                <ButtonGroup>
                    <CancelButton onClick={onCancel}>
                        {cancelText}
                    </CancelButton>
                    <ConfirmButton onClick={onConfirm}>
                        {confirmText}
                    </ConfirmButton>
                </ButtonGroup>
            </DialogContainer>
        </Overlay>
    );
};

export default ConfirmDialog;