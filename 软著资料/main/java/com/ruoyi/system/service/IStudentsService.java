package com.ruoyi.system.service;

import java.util.List;
import com.ruoyi.system.domain.Students;

/**
 * 学生Service接口
 * 
 * @author ruoyi
 * @date 2023-08-25
 */
public interface IStudentsService 
{
    /**
     * 查询学生
     * 
     * @param studentId 学生主键
     * @return 学生
     */
    public Students selectStudentsByStudentId(Long studentId);

    /**
     * 查询学生列表
     * 
     * @param students 学生
     * @return 学生集合
     */
    public List<Students> selectStudentsList(Students students);

    /**
     * 新增学生
     * 
     * @param students 学生
     * @return 结果
     */
    public int insertStudents(Students students);

    /**
     * 修改学生
     * 
     * @param students 学生
     * @return 结果
     */
    public int updateStudents(Students students);

    /**
     * 批量删除学生
     * 
     * @param studentIds 需要删除的学生主键集合
     * @return 结果
     */
    public int deleteStudentsByStudentIds(Long[] studentIds);

    /**
     * 删除学生信息
     * 
     * @param studentId 学生主键
     * @return 结果
     */
    public int deleteStudentsByStudentId(Long studentId);
}
