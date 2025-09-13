#!/usr/bin/env python3
"""
MP3播放器测试脚本
用于验证播放器的基本功能
"""

import os
import sys

def test_imports():
    """测试所有必要的模块是否能正确导入"""
    try:
        import tkinter as tk
        print("✓ tkinter 导入成功")
    except ImportError as e:
        print(f"✗ tkinter 导入失败: {e}")
        return False
    
    try:
        import pygame
        print("✓ pygame 导入成功")
    except ImportError as e:
        print(f"✗ pygame 导入失败: {e}")
        return False
    
    return True

def test_pygame_mixer():
    """测试pygame mixer是否能正确初始化"""
    try:
        import pygame
        pygame.mixer.init()
        print("✓ pygame mixer 初始化成功")
        pygame.mixer.quit()
        return True
    except Exception as e:
        print(f"✗ pygame mixer 初始化失败: {e}")
        return False

def test_mp3_files():
    """检查当前目录是否有MP3文件"""
    mp3_files = [f for f in os.listdir('.') if f.lower().endswith('.mp3')]
    if mp3_files:
        print(f"✓ 找到 {len(mp3_files)} 个MP3文件:")
        for file in mp3_files[:5]:  # 只显示前5个
            print(f"  - {file}")
        if len(mp3_files) > 5:
            print(f"  ... 还有 {len(mp3_files) - 5} 个文件")
    else:
        print("! 当前目录没有找到MP3文件")
        print("  请将一些MP3文件放在此目录中以便测试播放功能")
    return len(mp3_files) > 0

def main():
    """运行所有测试"""
    print("MP3播放器功能测试")
    print("=" * 40)
    
    # 测试导入
    print("\n1. 测试模块导入...")
    if not test_imports():
        print("\n❌ 模块导入测试失败，请安装缺失的依赖")
        return False
    
    # 测试pygame mixer
    print("\n2. 测试pygame mixer...")
    if not test_pygame_mixer():
        print("\n❌ pygame mixer测试失败")
        return False
    
    # 检查MP3文件
    print("\n3. 检查MP3文件...")
    has_mp3 = test_mp3_files()
    
    print("\n" + "=" * 40)
    if has_mp3:
        print("✅ 所有测试通过！可以运行MP3播放器")
        print("\n运行命令: python mp3_player.py")
    else:
        print("⚠️  基本功能正常，但建议添加MP3文件进行完整测试")
        print("\n运行命令: python mp3_player.py")
    
    return True

if __name__ == "__main__":
    main()
