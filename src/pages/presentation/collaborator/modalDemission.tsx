import Button from "../../../components/bootstrap/Button";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "../../../components/bootstrap/Modal";
import Picture from "../../../api/patch/Picture";
import { useEffect, useState } from "react";
import Select from "../../../components/bootstrap/forms/Select";
import { Options } from "../../../components/bootstrap/Option";

interface ModalDocumentProps {
    collaborator:any
    job:any
    openModal:boolean,
    closeModal:(value: boolean) => void;
}

export default function ModalDemission({ collaborator ,job ,openModal, closeModal }: ModalDocumentProps){
    
    return(
        <Modal isOpen={openModal} setIsOpen={closeModal} size={`lg`}>
            <ModalHeader>
                <h1 className="text-center" >Demissão</h1>
            </ModalHeader>
            <ModalBody>
                <div>
                <Select placeholder={'Motivo'} ariaLabel={"Motivo da demissão"}>
                    <Options list={[]} />
                </Select>
                </div>
            </ModalBody>
            <ModalFooter>
                <></>
            </ModalFooter>
        </Modal>
    )
}

