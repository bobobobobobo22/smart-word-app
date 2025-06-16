# -*- coding: utf-8 -*-
"""Tourism Interview Practice GUI using Tkinter.
Reads questions and answers from an Excel file and guides the user through
practice sessions with a timer and model answers.
"""

import tkinter as tk
from tkinter import scrolledtext
import pandas as pd
from pathlib import Path

FILE_NAME = '관광공사_면접셋.xlsx'
TIMER_SECONDS = 60


class InterviewApp:
    def __init__(self, master):
        self.master = master
        master.title('한국관광공사 체험형 인턴 면접 연습')
        master.geometry('800x600')

        self.data = self.load_data()
        self.index = 0
        self.timer_running = False
        self.remaining = TIMER_SECONDS

        self.question_label = tk.Label(master, text='', font=('Helvetica', 16, 'bold'), wraplength=750, justify='left')
        self.question_label.pack(pady=20)

        self.timer_label = tk.Label(master, text='', font=('Helvetica', 12))
        self.timer_label.pack()

        self.answer_text = scrolledtext.ScrolledText(master, width=90, height=20, state='disabled', wrap=tk.WORD)
        self.answer_text.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)

        self.button_frame = tk.Frame(master)
        self.button_frame.pack(pady=10)

        self.start_button = tk.Button(self.button_frame, text='답변 시작', command=self.start_timer)
        self.start_button.grid(row=0, column=0, padx=5)

        self.show_button = tk.Button(self.button_frame, text='모범답변 보기', state='disabled', command=self.show_answer)
        self.show_button.grid(row=0, column=1, padx=5)

        self.next_button = tk.Button(self.button_frame, text='다음 질문', command=self.next_question)
        self.next_button.grid(row=0, column=2, padx=5)

        self.display_question()

    def load_data(self):
        path = Path(FILE_NAME)
        if not path.exists():
            raise FileNotFoundError(f"{FILE_NAME} 파일을 찾을 수 없습니다.")
        df = pd.read_excel(path)
        required_columns = ['질문', '키워드', '모범답변', '꼬리질문1', '꼬리질문2']
        for col in required_columns:
            if col not in df.columns:
                raise ValueError(f"엑셀 파일에 '{col}' 컬럼이 필요합니다.")
        return df

    def display_question(self):
        if self.index >= len(self.data):
            self.finish()
            return
        question = self.data.loc[self.index, '질문']
        self.question_label.config(text=f"Q{self.index + 1}. {question}")
        self.answer_text.configure(state='normal')
        self.answer_text.delete('1.0', tk.END)
        self.answer_text.configure(state='disabled')
        self.timer_label.config(text='')
        self.show_button.config(state='disabled')
        self.remaining = TIMER_SECONDS

    def start_timer(self):
        if self.timer_running:
            return
        self.timer_running = True
        self.start_button.config(state='disabled')
        self.countdown()

    def countdown(self):
        self.timer_label.config(text=f"남은 시간: {self.remaining}초")
        if self.remaining <= 0:
            self.timer_running = False
            self.timer_label.config(text="시간 종료")
            self.show_button.config(state='normal')
            self.start_button.config(state='normal')
            return
        self.remaining -= 1
        self.master.after(1000, self.countdown)

    def show_answer(self):
        row = self.data.loc[self.index]
        text = (
            f"[키워드]\n{row['키워드']}\n\n"
            f"[모범답변]\n{row['모범답변']}\n\n"
            f"[꼬리질문1]\n{row['꼬리질문1']}\n\n"
            f"[꼬리질문2]\n{row['꼬리질문2']}\n"
        )
        self.answer_text.configure(state='normal')
        self.answer_text.delete('1.0', tk.END)
        self.answer_text.insert(tk.END, text)
        self.answer_text.configure(state='disabled')

    def next_question(self):
        self.index += 1
        if self.index >= len(self.data):
            self.finish()
            return
        self.display_question()

    def finish(self):
        self.question_label.config(text='모든 질문을 마쳤습니다.')
        self.timer_label.config(text='')
        self.start_button.config(state='disabled')
        self.show_button.config(state='disabled')
        self.next_button.config(state='disabled')
        self.answer_text.configure(state='normal')
        self.answer_text.delete('1.0', tk.END)
        self.answer_text.configure(state='disabled')


def main():
    root = tk.Tk()
    app = InterviewApp(root)
    root.mainloop()


if __name__ == '__main__':
    main()
