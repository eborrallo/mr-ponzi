import {useWeb3React} from '@web3-react/core';
import {Contract, ethers, Signer, BigNumber} from 'ethers';
import {
    ChangeEvent,
    MouseEvent,
    ReactElement,
    useEffect,
    useState
} from 'react';
import styled from 'styled-components';
import MrPonzi from '@this/artifacts/contracts/MrPonzi.sol/MrPonzi.json';
import {Provider} from '../utils/provider';
import {SectionDivider} from './SectionDivider';

const StyledDeployContractButton = styled.button`
  width: 180px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

const StyledContractDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 135px 2.7fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 0.4rem 0.6rem;
  line-height: 2fr;
`;

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
`;

export function MrPonziContainer(): ReactElement {
    const context = useWeb3React<Provider>();
    const {library, active, account} = context;

    const [signer, setSigner] = useState<Signer>();
    const [mrPonziContract, setMrPonziContract] = useState<Contract>();
    const [mrPonziContractAddr, setMrPonziContractAddr] = useState<string>('');
    const [mrPonziContractAddrInput, setMrPonziContractAddrInput] = useState<string>('');
    const [currentMrPonzi, setCurrentMrPonzi] = useState<string>('');

    useEffect((): void => {
        if (!library) {
            setSigner(undefined);
            return;
        }

        setSigner(library.getSigner());
    }, [library]);

    useEffect((): void => {
        if (!mrPonziContract) {
            return;
        }

        async function getMrPonzi(mrPonziContract: Contract): Promise<void> {
            const _currentMrPonzi = await mrPonziContract.mrPonzi();

            if (_currentMrPonzi !== currentMrPonzi) {
                setCurrentMrPonzi(_currentMrPonzi);
            }
        }

        getMrPonzi(mrPonziContract);
    }, [mrPonziContract, currentMrPonzi]);

    async function initContract(address: string) {
        //@ts-ignore
        const mrPonziContract = new ethers.Contract(address, MrPonzi.abi, signer)

        const mrPonzi = await mrPonziContract.mrPonzi();

        setMrPonziContract(mrPonziContract);
        setCurrentMrPonzi(mrPonzi);


        setMrPonziContractAddr(mrPonziContract.address);
    }

    function handleDeployContract(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        // only deploy the MrPonzi contract one time, when a signer is defined
        if (mrPonziContract || !signer) {
            return;
        }


        async function deployMrPonziContract(signer: Signer): Promise<void> {
            //@ts-ignore
            const mrPonziFactory = new ethers.ContractFactory(MrPonzi.abi, MrPonzi.bytecode, signer);

            try {
                let mrPonziContract = await mrPonziFactory.deploy({value: ethers.utils.parseEther("0.01")});

                mrPonziContract = await mrPonziContract.deployed();
                window.alert(`MrPonzi deployed to: ${mrPonziContract.address}`);

                await initContract(mrPonziContract.address)
            } catch (error: any) {
                window.alert(
                    'Error!' + (error && error.message ? `\n\n${error.message}` : '')
                );
            }
        }

        deployMrPonziContract(signer);
    }

    function handleNewMrPonziSubmit(event: MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();

        if (!mrPonziContract) {
            window.alert('Undefined mrPonziContract');
            return;
        }


        async function newMrPonziSubmit(mrPonziContract: Contract): Promise<void> {
            try {
                const actualPrize = await mrPonziContract.prize()
                const nextPrize = actualPrize.add(actualPrize.div(BigNumber.from(2)))

                const setTxn = await signer!.sendTransaction({
                    to: mrPonziContract.address,
                    value: nextPrize,
                })

                //const setTxn = await mrPonziContract.receive({value: ethers.utils.parseEther("0.01")});

                await setTxn.wait();

                const newMrPonzi = await mrPonziContract.mrPonzi();
                window.alert(`Success!\n\n Now you are the new Mr Ponzi: ${newMrPonzi}`);

                if (newMrPonzi !== currentMrPonzi) {
                    setCurrentMrPonzi(newMrPonzi);
                }
            } catch (error: any) {
                window.alert(
                    'Error!' + (error && error.message ? `\n\n${error.message}` : '')
                );
            }
        }

        newMrPonziSubmit(mrPonziContract);
    }

    function handleMrPonziContractInputChange(event: ChangeEvent<HTMLInputElement>): void {
        event.preventDefault();
        setMrPonziContractAddrInput(event.target.value);
    }

    async function handleLoadMrPonziContractAddress(event: MouseEvent<HTMLButtonElement>): Promise<void> {
        await initContract(mrPonziContractAddrInput)
    }

    return (
        <>
            <StyledDeployContractButton
                disabled={!!(!active || mrPonziContract)}
                style={{
                    cursor: !active || mrPonziContract ? 'not-allowed' : 'pointer',
                    borderColor: !active || mrPonziContract ? 'unset' : 'blue'
                }}
                onClick={handleDeployContract}
            >
                Deploy MrPonzi Contract
            </StyledDeployContractButton>
            <div style={{margin: 'auto'}}>

                <StyledLabel style={{marginRight: '12px'}} htmlFor="contractInput">Add current Mr Ponzi contract
                    address</StyledLabel>
                <StyledInput
                    id="contractInput"
                    type="text"
                    disabled={!!(!active || mrPonziContract)}
                    placeholder={currentMrPonzi ? '' : '<Contract not yet deployed>'}
                    onChange={handleMrPonziContractInputChange}
                    style={{fontStyle: currentMrPonzi ? 'normal' : 'italic'}}
                />
                <StyledButton
                    disabled={!!(!active || mrPonziContract)}
                    style={{
                        marginLeft: '12px',
                        width: 'auto',
                        cursor: !active || !mrPonziContract ? 'not-allowed' : 'pointer',
                        borderColor: !active || !mrPonziContract ? 'unset' : 'blue'
                    }}
                    onClick={handleLoadMrPonziContractAddress}
                > Save</StyledButton>
            </div>
            <SectionDivider/>
            <StyledContractDiv>

                <StyledLabel>Contract addr</StyledLabel>
                <div>
                    {mrPonziContractAddr ? (
                        mrPonziContractAddr
                    ) : (
                        <em>{`<Contract not yet deployed>`}</em>
                    )}
                </div>
                {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
                <div></div>
                <StyledLabel>Current Mr Ponzi</StyledLabel>
                <div>
                    {currentMrPonzi ? currentMrPonzi : <em>{`<Contract not yet deployed>`}</em>}
                </div>
                {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
                <div></div>
                <StyledLabel>Set new Mr Ponzi</StyledLabel>
                <StyledButton
                    disabled={!active || !mrPonziContract || currentMrPonzi === account}
                    style={{
                        width: 'auto',
                        cursor: !active || !mrPonziContract ? 'not-allowed' : 'pointer',
                        borderColor: !active || !mrPonziContract ? 'unset' : 'blue'
                    }}
                    onClick={handleNewMrPonziSubmit}
                >
                    {currentMrPonzi === account ? '👑 You are the actual Mr Ponzi 🏆' : 'Submit'}
                </StyledButton>

            </StyledContractDiv>
        </>
    );
}
