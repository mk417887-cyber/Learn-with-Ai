import React from 'react'
import {FileText, Plus} from 'lucide-react'

const EmptyState = ({onActionClick, title, description,buttonText}) => {
    return (
        <div className="flex flex-col items-center justify-center p-16 px-6 text-center bg-li near-to-br from-slate-100 to-slate-200 shadow-lg shadow-slate-200/50 rounded-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 shadow-lg shadow-slate-200/50 p-4">
                <FileText className="w-8 h-8 text-slate-400" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
            <p className=" text-sm text-slate-500 mb-8 max-w-sm leading-relaxed">{description}</p>
            {buttonText && onActionClick && (
                <button
                    onClick={onActionClick}
                    className="group relative inline-flex items-center gap-2 px-6 h-11 bg-linear-to-r from-slate-500 to-slate-600 hover:bg-linear-to-r hover:from-slate-600 hover:to-slate-500 rounded-xl text-white text-sm font-semibold transition-colors duration-200"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                        {buttonText}
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-slate-600 to-slate-700 rounded-xl opacity-0 group-hover:opacity-100 transition-transform duration-200" />
                </button>
            )}
        </div>
    )
}

export default EmptyState