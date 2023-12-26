"use client"

import styles from './LoadingIcon.module.css'
import React from 'react'

export default function LoadingIcon() {
    return (
        <div className={styles.loadingContainer}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    )
}