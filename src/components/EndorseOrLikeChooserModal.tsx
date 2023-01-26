import React, {useState} from "react";
import {Button, Modal, Header} from "semantic-ui-react";
import { TokenByIdQuery_token } from "../queries-thegraph/types-thegraph/TokenByIdQuery";
import EndorseTokenModal from "./EndorseTokenModal";

const EndorseOrLikeChooserModal = ( {open, setOpen, onLikeClicked, likeBtnDisabled, originalToken} : { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, onLikeClicked: () => Promise<void>, likeBtnDisabled: boolean,originalToken: TokenByIdQuery_token }) => {

    const onEndorseClicked = () => {
        setShowEndorseDialog(true)
        setOpen(false)
    }

    const [ showEndorseDialog, setShowEndorseDialog ] = useState(false)

    return (
        <>
            <Modal open={open} 
                closeIcon size="tiny"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}>
                <Modal.Content>
                    <Header as='h1'>Support community award</Header>
                    <p>You can show your support to another community member`s award in two ways, by <b>liking</b> it, or by <b>endorsing</b> the award with your short written statement.</p>
              
                    <ul>
                        <li>When you <b>like</b> an award, a specific Like token is minted and added to your own wallet. Liking is available to all community members who have connected their wallets to Talko platform.</li>
                        <li>When you <b>endorse</b> an award, your written statement (max 200 characters) is published in connection of the award. Endorsement is available only to those community members who have already received at least one community award themselves.</li>
                    </ul>

                    <Button primary disabled={likeBtnDisabled} onClick={onLikeClicked}>Like</Button>
                    <Button primary onClick={onEndorseClicked}>Endorse</Button>
              
                </Modal.Content>
            </Modal>
            <EndorseTokenModal open={showEndorseDialog} setOpen={setShowEndorseDialog} originalToken={originalToken}/>
        </>
    )
}

export default EndorseOrLikeChooserModal