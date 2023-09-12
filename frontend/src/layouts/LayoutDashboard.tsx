import Link from "next/link"
import {IoIosAddCircle} from 'react-icons/io'
import { useEffect, useState, useRef, useCallback } from "react"
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi"
import TextSubtitle from '@/components/TextSubtitle';
import Compact from "@/utils/compact";
import { RiCloseCircleFill } from "react-icons/ri";
import InputText from "@/components/Input/InputText";
import axios from "axios";
import Image from 'next/image'

const LayoutTrackingProcess = (props: any) => {
    const mobile = Compact()
    const [qrCode, setQrCode] = useState('')
    const [showModal, setShowModal] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [memberPoint, setMemberPoint] = useState('NO')
    const [redeem, setRedeem] = useState(false)

    const endpoint = process.env.NEXT_PUBLIC_EP

    const initialState = () => {
        setName('')
        setEmail('')
        setPhone('')
        setBirthDate('')
        setMemberPoint('NO')
        setRedeem(false)
    }

    useEffect(() => {
        if (!showModal && inputRef.current) {
          inputRef.current.focus();
        }
      }, [showModal]);
    
    const fetchAllData = useCallback(async () => {
        try {
            const config = {
                headers: {
                Authorization: `Bearer ${localStorage.getItem('cgrToken')}`,
                },
            };

            const qr = {
                in_qr: qrCode
            };

            const response = await axios.post(endpoint + 'redemption/get-qr', qr, config);
            setName(response.data.data[0].trd_name)
            setEmail(response.data.data[0].trd_email)
            setPhone(response.data.data[0].trd_mobile)
            setBirthDate(response.data.data[0].trd_birth_date)
            setMemberPoint(response.data.data[0].trd_member_status)
            setRedeem(response.data.data[0].trd_redem_status)
        } catch (error) {
          // Handle error here
        }
    }, [qrCode,endpoint]);

    const updateRedeem = useCallback(async () => {
        try {
            const config = {
                headers: {
                Authorization: `Bearer ${localStorage.getItem('cgrToken')}`,
                },
            };

            const qr = {
                in_qr: qrCode
            };

            const response = await axios.post(endpoint + 'redemption/redeem-update', qr, config);
            console.log(response.data.status)
        } catch (error) {
          // Handle error here
        }
    }, [qrCode,endpoint]);

    const handleCheck = async (event:any) => {
        event.preventDefault()
        setShowModal(true)
        fetchAllData()
    }

    const handleRedeem = (event:any) => {
        if(!redeem)
        {
            setRedeem(true)
            updateRedeem()
        }
    }


    return(
        <div className="flex w-full overflow-y-hidden h-screen bg-primary">
            <div className="flex flex-col w-full h-full px-5">
                <div className='flex mb-5'>
                 
                </div>

                <form className='flex flex-col w-full items-center justify-center' onSubmit={handleCheck}>
                <Image
                        src={'/aeonstore.jpg'}
                        width={250} height={10}
                        alt='Arena'
                        className={`p-1 mb-5`}/>
                    <input id="scanQR"
                        ref={inputRef}
                        className={`flex appearance-none border rounded text-sm ${mobile ? 'w-full' : 'w-1/3'}  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                        onChange={(e)=>setQrCode(e.target.value)} type="text" placeholder={`Scan QR`} value={qrCode}
                        autoFocus>
                    </input>
                </form>
            </div>

            <div id="modal-data" className={`${showModal ? 'fixed' : 'hidden'} fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75`}>
                <div className={`${mobile ? 'w-full mx-3' : 'w-1/2 pb-10'} bg-white rounded-md`}>
                    <div className="flex w-full justify-between p-3">
                        <div className=" uppercase text-sm font-bold text-secondary">Customer Data</div>
                        <label onClick={()=>{setShowModal(false);setQrCode('');initialState()}} className="flex text-primary cursor-pointer"><RiCloseCircleFill className="w-7 h-7"/></label>
                    </div>
                    {
                        name != '' ? 
                        <>
                            <div className={`flex ${mobile ? 'flex-col':'flex-row'} flex-row w-full`}>
                                <div className="flex flex-col p-3 text-sm w-full">
                                    <div className="text-secondary">Name</div>
                                    <div className="w-full border border-gray-200 rounded-md p-2 font-bold text-primary">{name}</div>
                                </div>
                                <div className="flex flex-col p-3 text-sm w-full">
                                    <div className="text-secondary">Email</div>
                                    <div className="w-full border border-gray-200 rounded-md p-2 font-bold text-primary">{email}</div>
                                </div>
                            </div>
                            <div className={`flex ${mobile ? 'flex-col':'flex-row'} flex-row w-full`}>
                                <div className="flex flex-col p-3 text-sm w-full">
                                    <div className="text-secondary">Phone</div>
                                    <div className="w-full border border-gray-200 rounded-md p-2 font-bold text-primary">{phone}</div>
                                </div>
                                <div className="flex flex-col p-3 text-sm w-full">
                                    <div className="text-secondary">Birth Date</div>
                                    <div className="w-full border border-gray-200 rounded-md p-2 font-bold text-primary">{birthDate}</div>
                                </div>
                            </div>
                            <div className={`flex ${mobile ? 'flex-col':'flex-row'} flex-row w-full`}>
                                <div className="flex flex-col p-3 text-sm w-full">
                                    <div className="text-secondary">AEON Point Member</div>
                                    <div className="w-full border border-gray-200 rounded-md p-2 font-bold text-primary">{memberPoint}</div>
                                </div>
                                <div className="flex flex-col p-3 text-sm w-full">
                                    <div className="text-secondary">Redeem Status</div>
                                    <div className="flex flex-row mt-2 items-center gap-3">
                                        <input type="checkbox" id="isActive" name="isActive" checked={redeem} onChange={handleRedeem} className="flex toggle toggle-primary toggle-sm"/>
                                        <div className="text-secondary">Active</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    : 
                    <div className="flex flex-col p-3 text-sm w-full">
                        <div className="text-secondary">Data not found</div>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default LayoutTrackingProcess