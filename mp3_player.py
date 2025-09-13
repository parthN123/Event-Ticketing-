import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import pygame
import os
import threading
import time

class MP3Player:
    def __init__(self, root):
        self.root = root
        self.root.title("MP3播放器")
        self.root.geometry("800x600")
        self.root.configure(bg="#2c3e50")
        
        # 初始化pygame mixer
        pygame.mixer.init()
        
        # 播放状态
        self.is_playing = False
        self.is_paused = False
        self.current_song = None
        self.playlist = []
        self.current_index = 0
        
        # 创建界面
        self.create_widgets()
        
        # 绑定关闭事件
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
    
    def create_widgets(self):
        # 主框架
        main_frame = tk.Frame(self.root, bg="#2c3e50")
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # 标题
        title_label = tk.Label(main_frame, text="MP3播放器", font=("Arial", 24, "bold"), 
                              fg="white", bg="#2c3e50")
        title_label.pack(pady=(0, 20))
        
        # 当前播放信息框架
        info_frame = tk.Frame(main_frame, bg="#34495e", relief=tk.RAISED, bd=2)
        info_frame.pack(fill=tk.X, pady=(0, 10))
        
        self.current_song_label = tk.Label(info_frame, text="未选择歌曲", 
                                          font=("Arial", 14), fg="white", bg="#34495e")
        self.current_song_label.pack(pady=10)
        
        # 进度条框架
        progress_frame = tk.Frame(main_frame, bg="#2c3e50")
        progress_frame.pack(fill=tk.X, pady=(0, 10))
        
        self.progress_var = tk.DoubleVar()
        self.progress_bar = ttk.Progressbar(progress_frame, variable=self.progress_var, 
                                          maximum=100, length=400)
        self.progress_bar.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 10))
        
        self.time_label = tk.Label(progress_frame, text="00:00 / 00:00", 
                                  font=("Arial", 10), fg="white", bg="#2c3e50")
        self.time_label.pack(side=tk.RIGHT)
        
        # 控制按钮框架
        control_frame = tk.Frame(main_frame, bg="#2c3e50")
        control_frame.pack(pady=10)
        
        # 创建播放控制按钮
        self.play_button = tk.Button(control_frame, text="▶", font=("Arial", 12, "bold"), 
                                   command=self.toggle_play_pause, bg="#4CAF50", fg="white",
                                   width=8, height=2, relief="flat", bd=0,
                                   activebackground="#45a049", activeforeground="white")
        self.play_button.pack(side=tk.LEFT, padx=5)
        
        self.stop_button = tk.Button(control_frame, text="⏹", font=("Arial", 12, "bold"), 
                                   command=self.stop_music, bg="#f44336", fg="white",
                                   width=8, height=2, relief="flat", bd=0,
                                   activebackground="#da190b", activeforeground="white")
        self.stop_button.pack(side=tk.LEFT, padx=5)
        
        self.prev_button = tk.Button(control_frame, text="⏮", font=("Arial", 12, "bold"), 
                                   command=self.prev_song, bg="#2196F3", fg="white",
                                   width=8, height=2, relief="flat", bd=0,
                                   activebackground="#1976D2", activeforeground="white")
        self.prev_button.pack(side=tk.LEFT, padx=5)
        
        self.next_button = tk.Button(control_frame, text="⏭", font=("Arial", 12, "bold"), 
                                   command=self.next_song, bg="#2196F3", fg="white",
                                   width=8, height=2, relief="flat", bd=0,
                                   activebackground="#1976D2", activeforeground="white")
        self.next_button.pack(side=tk.LEFT, padx=5)
        
        # 音量控制框架
        volume_frame = tk.Frame(main_frame, bg="#2c3e50")
        volume_frame.pack(pady=10)
        
        tk.Label(volume_frame, text="音量:", font=("Arial", 12), fg="white", bg="#2c3e50").pack(side=tk.LEFT)
        
        self.volume_var = tk.DoubleVar(value=0.7)
        self.volume_scale = tk.Scale(volume_frame, from_=0, to=1, resolution=0.1, 
                                   orient=tk.HORIZONTAL, variable=self.volume_var,
                                   command=self.set_volume, bg="#34495e", fg="white",
                                   length=200)
        self.volume_scale.pack(side=tk.LEFT, padx=10)
        
        # 文件操作按钮框架
        file_frame = tk.Frame(main_frame, bg="#2c3e50")
        file_frame.pack(pady=10)
        
        self.add_file_button = tk.Button(file_frame, text="添加文件", font=("Arial", 12),
                                       command=self.add_file, bg="#9b59b6", fg="white",
                                       width=12, height=2)
        self.add_file_button.pack(side=tk.LEFT, padx=5)
        
        self.add_folder_button = tk.Button(file_frame, text="添加文件夹", font=("Arial", 12),
                                         command=self.add_folder, bg="#9b59b6", fg="white",
                                         width=12, height=2)
        self.add_folder_button.pack(side=tk.LEFT, padx=5)
        
        self.clear_button = tk.Button(file_frame, text="清空列表", font=("Arial", 12),
                                    command=self.clear_playlist, bg="#e74c3c", fg="white",
                                    width=12, height=2)
        self.clear_button.pack(side=tk.LEFT, padx=5)
        
        # 播放列表框架
        playlist_frame = tk.Frame(main_frame, bg="#2c3e50")
        playlist_frame.pack(fill=tk.BOTH, expand=True, pady=(10, 0))
        
        tk.Label(playlist_frame, text="播放列表", font=("Arial", 14, "bold"), 
                fg="white", bg="#2c3e50").pack(anchor=tk.W, pady=(0, 5))
        
        # 创建Treeview用于显示播放列表
        columns = ("序号", "文件名", "时长")
        self.playlist_tree = ttk.Treeview(playlist_frame, columns=columns, show="headings", height=10)
        
        # 设置列标题
        self.playlist_tree.heading("序号", text="序号")
        self.playlist_tree.heading("文件名", text="文件名")
        self.playlist_tree.heading("时长", text="时长")
        
        # 设置列宽
        self.playlist_tree.column("序号", width=60, anchor=tk.CENTER)
        self.playlist_tree.column("文件名", width=400, anchor=tk.W)
        self.playlist_tree.column("时长", width=100, anchor=tk.CENTER)
        
        # 添加滚动条
        scrollbar = ttk.Scrollbar(playlist_frame, orient=tk.VERTICAL, command=self.playlist_tree.yview)
        self.playlist_tree.configure(yscrollcommand=scrollbar.set)
        
        self.playlist_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # 绑定双击事件
        self.playlist_tree.bind("<Double-1>", self.on_playlist_double_click)
        
        # 设置初始音量
        pygame.mixer.music.set_volume(0.7)
    
    def add_file(self):
        """添加单个文件到播放列表"""
        file_path = filedialog.askopenfilename(
            title="选择MP3文件",
            filetypes=[("MP3文件", "*.mp3"), ("所有文件", "*.*")]
        )
        
        if file_path:
            self.add_to_playlist(file_path)
    
    def add_folder(self):
        """添加文件夹中的所有MP3文件到播放列表"""
        folder_path = filedialog.askdirectory(title="选择包含MP3文件的文件夹")
        
        if folder_path:
            mp3_files = []
            for file in os.listdir(folder_path):
                if file.lower().endswith('.mp3'):
                    mp3_files.append(os.path.join(folder_path, file))
            
            if mp3_files:
                for file_path in mp3_files:
                    self.add_to_playlist(file_path)
                messagebox.showinfo("成功", f"已添加 {len(mp3_files)} 个MP3文件到播放列表")
            else:
                messagebox.showwarning("警告", "所选文件夹中没有找到MP3文件")
    
    def add_to_playlist(self, file_path):
        """添加文件到播放列表"""
        if file_path not in self.playlist:
            self.playlist.append(file_path)
            filename = os.path.basename(file_path)
            
            # 获取文件时长
            try:
                sound = pygame.mixer.Sound(file_path)
                duration = sound.get_length()
                duration_str = f"{int(duration//60):02d}:{int(duration%60):02d}"
            except:
                duration_str = "未知"
            
            # 添加到Treeview
            self.playlist_tree.insert("", tk.END, values=(len(self.playlist), filename, duration_str))
    
    def clear_playlist(self):
        """清空播放列表"""
        if self.is_playing:
            self.stop_music()
        
        self.playlist.clear()
        self.playlist_tree.delete(*self.playlist_tree.get_children())
        self.current_song_label.config(text="未选择歌曲")
        self.progress_var.set(0)
        self.time_label.config(text="00:00 / 00:00")
    
    def on_playlist_double_click(self, event):
        """双击播放列表项时播放对应歌曲"""
        selection = self.playlist_tree.selection()
        if selection:
            item = self.playlist_tree.item(selection[0])
            index = int(item['values'][0]) - 1
            if 0 <= index < len(self.playlist):
                self.current_index = index
                self.play_song()
    
    def play_song(self):
        """播放当前歌曲"""
        if not self.playlist or self.current_index >= len(self.playlist):
            return
        
        try:
            self.current_song = self.playlist[self.current_index]
            pygame.mixer.music.load(self.current_song)
            pygame.mixer.music.play()
            
            self.is_playing = True
            self.is_paused = False
            self.play_button.config(text="⏸")
            
            # 更新当前歌曲显示
            filename = os.path.basename(self.current_song)
            self.current_song_label.config(text=f"正在播放: {filename}")
            
            # 开始进度更新线程
            self.start_progress_thread()
            
        except Exception as e:
            messagebox.showerror("错误", f"无法播放文件: {str(e)}")
    
    def toggle_play_pause(self):
        """切换播放/暂停状态"""
        if not self.playlist:
            messagebox.showwarning("警告", "播放列表为空")
            return
        
        if not self.is_playing and not self.is_paused:
            # 开始播放
            self.play_song()
        elif self.is_playing:
            # 暂停
            pygame.mixer.music.pause()
            self.is_playing = False
            self.is_paused = True
            self.play_button.config(text="▶")
        elif self.is_paused:
            # 恢复播放
            pygame.mixer.music.unpause()
            self.is_playing = True
            self.is_paused = False
            self.play_button.config(text="⏸")
    
    def stop_music(self):
        """停止播放"""
        pygame.mixer.music.stop()
        self.is_playing = False
        self.is_paused = False
        self.play_button.config(text="▶")
        self.progress_var.set(0)
        self.time_label.config(text="00:00 / 00:00")
    
    def prev_song(self):
        """播放上一首"""
        if not self.playlist:
            return
        
        self.current_index = (self.current_index - 1) % len(self.playlist)
        if self.is_playing or self.is_paused:
            self.play_song()
    
    def next_song(self):
        """播放下一首"""
        if not self.playlist:
            return
        
        self.current_index = (self.current_index + 1) % len(self.playlist)
        if self.is_playing or self.is_paused:
            self.play_song()
    
    def set_volume(self, value):
        """设置音量"""
        volume = float(value)
        pygame.mixer.music.set_volume(volume)
    
    def start_progress_thread(self):
        """启动进度更新线程"""
        if hasattr(self, 'progress_thread') and self.progress_thread.is_alive():
            return
        
        self.progress_thread = threading.Thread(target=self.update_progress, daemon=True)
        self.progress_thread.start()
    
    def update_progress(self):
        """更新播放进度"""
        while self.is_playing and not self.is_paused:
            try:
                # 获取当前播放位置（pygame没有直接的方法，这里简化处理）
                time.sleep(1)
                # 这里可以添加更精确的进度计算
            except:
                break
    
    def on_closing(self):
        """程序关闭时的清理工作"""
        if self.is_playing or self.is_paused:
            pygame.mixer.music.stop()
        pygame.mixer.quit()
        self.root.destroy()

def main():
    root = tk.Tk()
    app = MP3Player(root)
    root.mainloop()

if __name__ == "__main__":
    main()
